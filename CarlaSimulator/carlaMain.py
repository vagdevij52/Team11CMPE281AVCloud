#!/usr/bin/env python

# Copyright (c) 2018 Intel Labs.
# authors: German Ros (german.ros@intel.com)
#
# This work is licensed under the terms of the MIT license.
# For a copy, see <https://opensource.org/licenses/MIT>.

"""Example of automatic vehicle control from client side."""

from __future__ import print_function

import argparse
import collections
import datetime
import glob
import logging
import math
import os
import json
import time
import subprocess
import signal
import psutil

import numpy.random as random
import re
import sys
import weakref

# ==============================================================================
# -- PyQt5 Imports -------------------------------------------------------------
# ==============================================================================
from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtCore import pyqtSlot
from pymongo import MongoClient

import pyodbc
from sync_data import sen_main

server = 'tcp:swessqlserver.co7pzwu1hwvu.us-east-1.rds.amazonaws.com'
port = '1433' # Optional
username = 'admin'
password = 'Swetha12345'
database = 'AVCLOUD'
cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()

#Sample select query
# print ('Reading data from table')
# tsql = "SELECT RideVehicleID,RideStatus FROM VEHICLERIDEDETAILS;"
# with cursor.execute(tsql):
#     row = cursor.fetchone()
#     while row:
#         print (str(row[0]) + " " + str(row[1]))
#         row = cursor.fetchone()


try:
    import pygame
    from pygame.locals import KMOD_CTRL
    from pygame.locals import K_ESCAPE
    from pygame.locals import K_q
except ImportError:
    raise RuntimeError('cannot import pygame, make sure pygame package is installed')

try:
    import numpy as np
except ImportError:
    raise RuntimeError(
        'cannot import numpy, make sure numpy package is installed')

# ==============================================================================
# -- Find CARLA module ---------------------------------------------------------
# ==============================================================================
try:
    sys.path.append(glob.glob('../carla/dist/carla-*%d.%d-%s.egg' % (
        sys.version_info.major,
        sys.version_info.minor,
        'win-amd64' if os.name == 'nt' else 'linux-x86_64'))[0])
except IndexError:
    pass
try:
    sys.path.append('PythonAPI')
except IndexError:
    pass
# ==============================================================================
# -- Add PythonAPI for release mode --------------------------------------------
# ==============================================================================
try:
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/carla')
except IndexError:
    pass

import carla
from carla import ColorConverter as cc
from carla import VehicleLightState as vls

from agents.navigation.behavior_agent import BehaviorAgent  # pylint: disable=import-error
from agents.navigation.basic_agent import BasicAgent  # pylint: disable=import-error
from agents.tools.misc import compute_distance
from agents.tools.misc import draw_waypoints
from agents.navigation.global_route_planner import GlobalRoutePlanner
# ==============================================================================
# -- Global functions ----------------------------------------------------------
# ==============================================================================


info = list()
route_info = list()
distance= 0
# -- GUI variables ----------------------------------------------------------
GUI_vehicle = ""
GUI_lighting = ""
GUI_weather = ""
GUI_num_pedestrians = 0
GUI_num_vehicles = 0

GUI_lane_violation_count = 0



# ---------------------------------------------------------------------------

def find_weather_presets():
    """Method to find weather presets"""
    rgx = re.compile('.+?(?:(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|$)')

    def name(x): return ' '.join(m.group(0) for m in rgx.finditer(x))

    presets = [x for x in dir(carla.WeatherParameters) if re.match('[A-Z].+', x)]
    return [(getattr(carla.WeatherParameters, x), name(x)) for x in presets]


def get_actor_display_name(actor, truncate=250):
    """Method to get actor display name"""
    name = ' '.join(actor.type_id.replace('_', '.').title().split('.')[1:])
    return (name[:truncate - 1] + u'\u2026') if len(name) > truncate else name


# ==============================================================================
# -- World ---------------------------------------------------------------
# ==============================================================================

class World(object):
    """ Class representing the surrounding environment """

    def __init__(self, carla_world, hud, args):
        """Constructor method"""
        self._args = args
        self.world = carla_world
        try:
            self.map = self.world.get_map()
        except RuntimeError as error:
            print('RuntimeError: {}'.format(error))
            print('  The server could not send the OpenDRIVE (.xodr) file:')
            print('  Make sure it exists, has the same name of your town, and is correct.')
            sys.exit(1)
        self.hud = hud
        self.player = None
        self.collision_sensor = None
        self.lane_invasion_sensor = None
        self.gnss_sensor = None
        self.camera_manager = None
        self._weather_presets = find_weather_presets()
        self._weather_index = 0
        self._actor_filter = args.filter
        self.restart(args)
        self.world.on_tick(hud.on_world_tick)
        self.recording_enabled = False
        self.recording_start = 0

    def restart(self, args):
        """Restart the world"""
        # Keep same camera config if the camera manager exists.
        cam_index = self.camera_manager.index if self.camera_manager is not None else 0
        cam_pos_id = self.camera_manager.transform_index if self.camera_manager is not None else 0

        # -------------------- GUI Parameters --------------------
        # --------------------------------------------------------
        # clear_to_db()
        if os.path.isfile("/opt/carla-simulator/PythonAPI/examples/sensorData/data.json"):
            os.remove("/opt/carla-simulator/PythonAPI/examples/sensorData/data.json")
        else:  ## Show an error ##
            print("Error: file not found")

        # Get a random blueprint.
        blueprint = random.choice(self.world.get_blueprint_library().filter(GUI_vehicle))
        # blueprint = self.world.get_blueprint_library().filter(GUI_vehicle)
        blueprint.set_attribute('role_name', 'hero')
        if blueprint.has_attribute('color'):
            color = random.choice(blueprint.get_attribute('color').recommended_values)
            blueprint.set_attribute('color', color)
        # print(" Spwaning " + str(GUI_num_vehicles) +" Vehicles")
        # print(" Spwaning " + str(GUI_num_pedestrians) +" Pedestrians")
        sim_vehicle_list = list()
        # Spawns the number vehicles specified by the user
        for indx in range(GUI_num_vehicles):
            # print("inside Vehicle Spawn !")
            vehicle_bp = random.choice(self.world.get_blueprint_library().filter("vehicle.*"))
            vehicle_spawn_point = random.choice(self.map.get_spawn_points())
            try:
                sim_vehicle = self.world.spawn_actor(vehicle_bp, vehicle_spawn_point)
                sim_vehicle.apply_physics_control(
                    carla.VehiclePhysicsControl(max_rpm=5000.0, center_of_mass=carla.Vector3D(0.0, 0.0, 0.0),
                                                torque_curve=[[0, 400], [5000, 400]]))
                sim_vehicle_list.append(sim_vehicle)
            except:
                print("Vehicle Spawn Point Collision!")

        SetVehicleLightState = carla.command.SetVehicleLightState
        current_lights = carla.VehicleLightState.NONE
        current_lights |= carla.VehicleLightState.All
        for vehicles in sim_vehicle_list:
            vehicles.set_autopilot(True)
            SetVehicleLightState(vehicles, current_lights)

        print('Spawned %d Vehicles.' % (len(sim_vehicle_list)))

        sim_pedestrians_list = list()

        # Spawn the player.
        print('Reading origin from trip id')
        tsql = "SELECT RideOrigin FROM VEHICLERIDEDETAILS WHERE RideID = ?;"
        with cursor.execute(tsql, args.trip_id):
            row = cursor.fetchone()
            get_origin = row[0]
            while row:
                row = cursor.fetchone()
        print(get_origin)



        if get_origin == "Santa Clara":
            x_loc_o = 53.8
            y_loc_o = 140.8
            x_loc_d = 53.8
            y_loc_d = 140.8
        elif get_origin == "San Francisco":
            x_loc_o = 110.5
            y_loc_o = 53.8
            x_loc_d = 110.5
            y_loc_d = 53.8
        elif get_origin == "Los Angeles":
            x_loc_o = -113.8
            y_loc_o = -27.4
            x_loc_d = -113.8
            y_loc_d = -27.4
        elif get_origin == "Las Gatos":
            x_loc_o = -52.6
            y_loc_o = 75.0
            x_loc_d = -52.6
            y_loc_d = 75.0
        elif get_origin == "San Jose":
            x_loc_o = -50.0
            y_loc_o = 27.0
            x_loc_d = -36.8
            y_loc_d = 127.8
        elif get_origin == "Fremont":
            x_loc_o = 44.4
            y_loc_o = 44.4
            x_loc_d = 44.4
            y_loc_d = 44.4

        if self.player is not None:
            spawn_point = self.player.get_transform()
            spawn_point.location.z += 2.0
            spawn_point.rotation.roll = 0.0
            spawn_point.rotation.pitch = 90.0
            self.destroy()
            self.player = self.world.try_spawn_actor(blueprint, spawn_point)
            self.modify_vehicle_physics(self.player)
        while self.player is None:
            if not self.map.get_spawn_points():
                print('There are no spawn points available in your map/town.')
                print('Please add some Vehicle Spawn Point to your UE4 scene.')
                sys.exit(1)
            spawn_points = self.map.get_spawn_points()
            spawn_point = random.choice(spawn_points) if spawn_points else carla.Transform()
            spawn_point.location.x = x_loc_d
            spawn_point.location.y = y_loc_d
            self.player = self.world.try_spawn_actor(blueprint, spawn_point)
            self.modify_vehicle_physics(self.player)
            # current_lights = carla.VehicleLightState.All | carla.VehicleLightState.Position
            # SetVehicleLightState(self.player, current_lights)


            # -------------------- GUI Parameters --------------------
            # --------------------------------------------------------

            # Lighting settings logic for GUI
            if GUI_lighting == "Day":
                light = 50
            elif GUI_lighting == "Midday":
                light = 90
            elif GUI_lighting == "Night":
                light = -90

            # Weather settings logic for GUI
            if (GUI_weather == "Clear"):
                weather = carla.WeatherParameters(cloudiness=0, sun_altitude_angle=light)
                self.world.set_weather(weather)
            elif (GUI_weather == "Cloudy"):
                weather = carla.WeatherParameters(cloudiness=100, sun_altitude_angle=light)
                self.world.set_weather(weather)
            elif (GUI_weather == "Rain"):
                weather = carla.WeatherParameters(precipitation=100, sun_altitude_angle=light)
                self.world.set_weather(weather)
            elif (GUI_weather == "Foggy"):
                weather = carla.WeatherParameters(fog_density=30, sun_altitude_angle=light)
                self.world.set_weather(weather)
            elif (GUI_weather == "Windy"):
                weather = carla.WeatherParameters(wind_intensity=100, sun_altitude_angle=light)
                self.world.set_weather(weather)

            # --------------------------------------------------------
            # --------------------------------------------------------
        if self._args.sync:
            self.world.tick()
        else:
            self.world.wait_for_tick()

        # Set up the sensors.
        self.collision_sensor = CollisionSensor(self.player, self.hud)
        self.lane_invasion_sensor = LaneInvasionSensor(self.player, self.hud)
        self.gnss_sensor = GnssSensor(self.player)
        self.camera_manager = CameraManager(self.player, self.hud)
        self.camera_manager.transform_index = cam_pos_id
        self.camera_manager.set_sensor(cam_index, notify=False)
        actor_type = get_actor_display_name(self.player)
        self.hud.notification(actor_type)

    def next_weather(self, reverse=False):
        """Get next weather setting"""
        self._weather_index += -1 if reverse else 1
        self._weather_index %= len(self._weather_presets)
        preset = self._weather_presets[self._weather_index]
        self.hud.notification('Weather: %s' % preset[1])
        self.player.get_world().set_weather(preset[0])

    def modify_vehicle_physics(self, actor):
        # If actor is not a vehicle, we cannot use the physics control
        try:
            physics_control = actor.get_physics_control()
            physics_control.use_sweep_wheel_collision = True
            actor.apply_physics_control(physics_control)
        except Exception:
            pass

    def tick(self, clock):
        """Method for every tick"""
        self.hud.tick(self, clock)

    def render(self, display):
        """Render world"""
        self.camera_manager.render(display)
        self.hud.render(display)

    def destroy_sensors(self):
        """Destroy sensors"""
        self.camera_manager.sensor.destroy()
        self.camera_manager.sensor = None
        self.camera_manager.index = None

    def destroy(self):
        """Destroys all actors"""
        actors = [
            self.camera_manager.sensor,
            self.collision_sensor.sensor,
            self.lane_invasion_sensor.sensor,
            self.gnss_sensor.sensor,
            self.player]
        for actor in actors:
            if actor is not None:
                actor.destroy()


# ==============================================================================
# -- KeyboardControl -----------------------------------------------------------
# ==============================================================================


class KeyboardControl(object):
    def __init__(self, world):
        world.hud.notification("Press 'H' or '?' for help.", seconds=4.0)

    def parse_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return True
            if event.type == pygame.KEYUP:
                if self._is_quit_shortcut(event.key):
                    return True

    @staticmethod
    def _is_quit_shortcut(key):
        """Shortcut for quitting"""
        return (key == K_ESCAPE) or (key == K_q and pygame.key.get_mods() & KMOD_CTRL)


# ==============================================================================
# -- HUD -----------------------------------------------------------------------
# ==============================================================================


class HUD(object):
    """Class for HUD text"""

    def __init__(self, width, height):
        """Constructor method"""
        self.dim = (width, height)
        font = pygame.font.Font(pygame.font.get_default_font(), 20)
        font_name = 'courier' if os.name == 'nt' else 'mono'
        fonts = [x for x in pygame.font.get_fonts() if font_name in x]
        default_font = 'ubuntumono'
        mono = default_font if default_font in fonts else fonts[0]
        mono = pygame.font.match_font(mono)
        self._font_mono = pygame.font.Font(mono, 12 if os.name == 'nt' else 14)
        self._notifications = FadingText(font, (width, 40), (0, height - 40))
        self.help = HelpText(pygame.font.Font(mono, 24), width, height)
        self.server_fps = 0
        self.frame = 0
        self.simulation_time = 0
        self._show_info = True
        self._info_text = []
        self._server_clock = pygame.time.Clock()

    def on_world_tick(self, timestamp):
        """Gets informations from the world at every tick"""
        self._server_clock.tick()
        self.server_fps = self._server_clock.get_fps()
        self.frame = timestamp.frame_count
        self.simulation_time = timestamp.elapsed_seconds

    def tick(self, world, clock):
        """HUD method for every tick"""
        self._notifications.tick(world, clock)
        if not self._show_info:
            return
        transform = world.player.get_transform()
        vel = world.player.get_velocity()
        control = world.player.get_control()
        heading = 'N' if abs(transform.rotation.yaw) < 89.5 else ''
        heading += 'S' if abs(transform.rotation.yaw) > 90.5 else ''
        heading += 'E' if 179.5 > transform.rotation.yaw > 0.5 else ''
        heading += 'W' if -0.5 > transform.rotation.yaw > -179.5 else ''
        colhist = world.collision_sensor.get_collision_history()
        collision = [colhist[x + self.frame - 200] for x in range(0, 200)]
        max_col = max(1.0, max(collision))
        collision = [x / max_col for x in collision]
        vehicles = world.world.get_actors().filter('vehicle.*')

        world1 = world.player.get_world()
        map1 = world1.get_map()
        waypoint = map1.get_waypoint(world.player.get_location())
        lane_id = waypoint.lane_id
        road_id = waypoint.road_id


        self._info_text = [
            'Server:  % 16.0f FPS' % self.server_fps,
            'Client:  % 16.0f FPS' % clock.get_fps(),
            '',
            'Vehicle: % 20s' % get_actor_display_name(world.player, truncate=20),
            'Map:     % 20s' % world.map.name.split('/')[-1],
            'Simulation time: % 12s' % datetime.timedelta(seconds=int(self.simulation_time)),
            '',
            'Speed:   % 15.0f km/h' % (3.6 * math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2)),
            u'Heading:% 16.0f\N{DEGREE SIGN} % 2s' % (transform.rotation.yaw, heading),
            'Location:% 20s' % ('(% 5.1f, % 5.1f)' % (transform.location.x, transform.location.y)),
            'GNSS:% 24s' % ('(% 2.6f, % 3.6f)' % (world.gnss_sensor.lat, world.gnss_sensor.lon)),
            'Height:  % 18.0f m' % transform.location.z,
            'Lane Id: % 8d' % lane_id,
            'Road Id: % 8d' % road_id,
            '']
        if isinstance(control, carla.VehicleControl):
            self._info_text += [
                ('Throttle:', control.throttle, 0.0, 1.0),
                ('Steer:', control.steer, -1.0, 1.0),
                ('Brake:', control.brake, 0.0, 1.0),
                ('Reverse:', control.reverse),
                ('Hand brake:', control.hand_brake),
                ('Manual:', control.manual_gear_shift),
                'Gear:        %s' % {-1: 'R', 0: 'N'}.get(control.gear, control.gear)]
        elif isinstance(control, carla.WalkerControl):
            self._info_text += [
                ('Speed:', control.speed, 0.0, 5.556),
                ('Jump:', control.jump)]
        self._info_text += [
            '',
            'Collision:',
            collision,
            '',
            'Number of vehicles: % 8d' % len(vehicles)]

        if len(vehicles) > 1:
            self._info_text += ['Nearby vehicles:']

        def dist(l):
            return math.sqrt((l.x - transform.location.x) ** 2 + (l.y - transform.location.y)
                             ** 2 + (l.z - transform.location.z) ** 2)

        vehicles = [(dist(x.get_location()), x) for x in vehicles if x.id != world.player.id]
        nearby_vehicles = list()
        for dist, vehicle in sorted(vehicles):
            if dist > 200.0:
                break
            vehicle_type = get_actor_display_name(vehicle, truncate=22)
            self._info_text.append('% 4dm %s' % (dist, vehicle_type))
            nearby_vehicles.append((dist, vehicle_type))

        # for actor in world.get_actors():
        #     if actor.attributes.get('role_name') == 'hero':
        #         player = actor
        #         break
        # for tl in world.get_actors().filter('traffic.traffic_light*'):
        #     # Trigger/bounding boxes contain half extent and offset relative to the actor.
        #     trigger_transform = tl.get_transform()
        #     trigger_transform.location += tl.trigger_volume.location
        #     trigger_extent = tl.trigger_volume.extent
        #
        # self._info_text += ['Traffic Lights:',trigger_extent]

        def rotate_point(point, angle):
            """
            rotate a given point by a given angle
            """
            x_ = math.cos(math.radians(angle)) * point.x - math.sin(math.radians(angle)) * point.y
            y_ = math.sin(math.radians(angle)) * point.x - math.cos(math.radians(angle)) * point.y

            return carla.Vector3D(x_, y_, point.z)


        traffic_light_location = list()
        if world.player.is_at_traffic_light():
            self._info_text += ['Traffic Light Location:']
            traffic_light = world.player.get_traffic_light()
            base_transform = traffic_light.get_transform()
            base_rot = base_transform.rotation.yaw
            area_loc = base_transform.transform(traffic_light.trigger_volume.location)
            area_ext = traffic_light.trigger_volume.extent

            point = rotate_point(carla.Vector3D(0, 0, area_ext.z), base_rot)
            point_location = area_loc + carla.Location(x=point.x, y=point.y)
            print_location = carla.Location(point_location.x, point_location.y, point_location.z)
            self._info_text.append('%s %s' % (point_location.x, point_location.y))
            traffic_light_location.append((point_location.x, point_location.y))
            # print(point_location.x, point_location.y)

        carla_info = {
            "Server FPS": self.server_fps,
            "Client FPS": clock.get_fps(),
            "Vehicle": get_actor_display_name(world.player, truncate=20),
            "Ride ID": GUI_trip_id,
            "Map": world.map.name,
            "Weather": GUI_weather,
            "Lighting": GUI_lighting,
            "Simulation time (s)": int(self.simulation_time),
            "Speed (km/h)": (3.6 * math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2)),
            "Heading": transform.rotation.yaw,
            "Heading Direction": heading,
            "Location x": transform.location.x,
            "Location y": transform.location.y,
            "GNSS Latitude": world.gnss_sensor.lat,
            "GNSS Longitude": world.gnss_sensor.lon,
            "Height": transform.location.z,
            "Throttle": (control.throttle, 0.0, 1.0),
            "Steer": (control.steer, -1.0, 1.0),
            "Brake": (control.brake, 0.0, 1.0),
            "Reverse": control.reverse,
            "Hand brake": control.hand_brake,
            "Manual": control.manual_gear_shift,
            "Collision": collision,
            "Number of vehicles": len(vehicles),
            'Number of Pedestrians': GUI_num_pedestrians,
            "Nearby vehicles (m)": nearby_vehicles,
            "Number of lane violations": GUI_lane_violation_count,
            "Traffic Lights": traffic_light_location,
            "Road ID": road_id,
            "Lane ID": lane_id,
        }
        info.append(carla_info)

        data = {}
        data['frame'] = []
        data['frame'].append(carla_info)

        with open("/opt/carla-simulator/PythonAPI/examples/sensorData/data.json", 'w') as outfile:
            try:
                json.dump(data, outfile)
                outfile.write('\n')# omit in 3.x!
            except UnicodeEncodeError:
                pass

        # write_to_db(carla_info)
        # routes = {
        #     "Ride ID": GUI_trip_id,
        #     "Road ID": road_id,
        #     "Lane ID": lane_id,
        #     "Location x": transform.location.x,
        #     "Location y": transform.location.y,
        # }

        # write_to_routedb(routes)

    # print(self._info_text)
    def toggle_info(self):
        """Toggle info on or off"""
        self._show_info = not self._show_info

    def notification(self, text, seconds=2.0):
        """Notification text"""
        self._notifications.set_text(text, seconds=seconds)

    def error(self, text):
        """Error text"""
        self._notifications.set_text('Error: %s' % text, (255, 0, 0))

    def render(self, display):
        """Render for HUD class"""
        if self._show_info:
            info_surface = pygame.Surface((220, self.dim[1]))
            info_surface.set_alpha(100)
            display.blit(info_surface, (0, 0))
            v_offset = 4
            bar_h_offset = 100
            bar_width = 106
            for item in self._info_text:
                if v_offset + 18 > self.dim[1]:
                    break
                if isinstance(item, list):
                    if len(item) > 1:
                        points = [(x + 8, v_offset + 8 + (1 - y) * 30) for x, y in enumerate(item)]
                        pygame.draw.lines(display, (255, 136, 0), False, points, 2)
                    item = None
                    v_offset += 18
                elif isinstance(item, tuple):
                    if isinstance(item[1], bool):
                        rect = pygame.Rect((bar_h_offset, v_offset + 8), (6, 6))
                        pygame.draw.rect(display, (255, 255, 255), rect, 0 if item[1] else 1)
                    else:
                        rect_border = pygame.Rect((bar_h_offset, v_offset + 8), (bar_width, 6))
                        pygame.draw.rect(display, (255, 255, 255), rect_border, 1)

                        fig = (item[1] - item[2]) / (item[3] - item[2])
                        if item[2] < 0.0:
                            rect = pygame.Rect(
                                (bar_h_offset + fig * (bar_width - 6), v_offset + 8), (6, 6))
                        else:
                            rect = pygame.Rect((bar_h_offset, v_offset + 8), (fig * bar_width, 6))
                        pygame.draw.rect(display, (255, 255, 255), rect)
                    item = item[0]
                if item:  # At this point has to be a str.
                    surface = self._font_mono.render(item, True, (255, 255, 255))
                    display.blit(surface, (8, v_offset))
                v_offset += 18
        self._notifications.render(display)
        self.help.render(display)


# ==============================================================================
# -- FadingText ----------------------------------------------------------------
# ==============================================================================


class FadingText(object):
    """ Class for fading text """

    def __init__(self, font, dim, pos):
        """Constructor method"""
        self.font = font
        self.dim = dim
        self.pos = pos
        self.seconds_left = 0
        self.surface = pygame.Surface(self.dim)

    def set_text(self, text, color=(255, 255, 255), seconds=2.0):
        """Set fading text"""
        text_texture = self.font.render(text, True, color)
        self.surface = pygame.Surface(self.dim)
        self.seconds_left = seconds
        self.surface.fill((0, 0, 0, 0))
        self.surface.blit(text_texture, (10, 11))

    def tick(self, _, clock):
        """Fading text method for every tick"""
        delta_seconds = 1e-3 * clock.get_time()
        self.seconds_left = max(0.0, self.seconds_left - delta_seconds)
        self.surface.set_alpha(500.0 * self.seconds_left)

    def render(self, display):
        """Render fading text method"""
        display.blit(self.surface, self.pos)


# ==============================================================================
# -- HelpText ------------------------------------------------------------------
# ==============================================================================


class HelpText(object):
    """ Helper class for text render"""

    def __init__(self, font, width, height):
        """Constructor method"""
        lines = __doc__.split('\n')
        self.font = font
        self.dim = (680, len(lines) * 22 + 12)
        self.pos = (0.5 * width - 0.5 * self.dim[0], 0.5 * height - 0.5 * self.dim[1])
        self.seconds_left = 0
        self.surface = pygame.Surface(self.dim)
        self.surface.fill((0, 0, 0, 0))
        for i, line in enumerate(lines):
            text_texture = self.font.render(line, True, (255, 255, 255))
            self.surface.blit(text_texture, (22, i * 22))
            self._render = False
        self.surface.set_alpha(220)

    def toggle(self):
        """Toggle on or off the render help"""
        self._render = not self._render

    def render(self, display):
        """Render help text method"""
        if self._render:
            display.blit(self.surface, self.pos)


# ==============================================================================
# -- CollisionSensor -----------------------------------------------------------
# ==============================================================================


class CollisionSensor(object):
    """ Class for collision sensors"""

    def __init__(self, parent_actor, hud):
        """Constructor method"""
        self.sensor = None
        self.history = []
        self._parent = parent_actor
        self.hud = hud
        world = self._parent.get_world()
        blueprint = world.get_blueprint_library().find('sensor.other.collision')
        self.sensor = world.spawn_actor(blueprint, carla.Transform(), attach_to=self._parent)
        # We need to pass the lambda a weak reference to
        # self to avoid circular reference.
        weak_self = weakref.ref(self)
        self.sensor.listen(lambda event: CollisionSensor._on_collision(weak_self, event))

    def get_collision_history(self):
        """Gets the history of collisions"""
        history = collections.defaultdict(int)
        for frame, intensity in self.history:
            history[frame] += intensity
        return history

    @staticmethod
    def _on_collision(weak_self, event):
        """On collision method"""
        self = weak_self()
        if not self:
            return
        actor_type = get_actor_display_name(event.other_actor)
        self.hud.notification('Collision with %r' % actor_type)
        impulse = event.normal_impulse
        intensity = math.sqrt(impulse.x ** 2 + impulse.y ** 2 + impulse.z ** 2)
        self.history.append((event.frame, intensity))
        if len(self.history) > 4000:
            self.history.pop(0)


# ==============================================================================
# -- LaneInvasionSensor --------------------------------------------------------
# ==============================================================================


class LaneInvasionSensor(object):
    """Class for lane invasion sensors"""

    def __init__(self, parent_actor, hud):
        """Constructor method"""
        self.sensor = None
        self._parent = parent_actor
        self.hud = hud
        world = self._parent.get_world()
        bp = world.get_blueprint_library().find('sensor.other.lane_invasion')
        self.sensor = world.spawn_actor(bp, carla.Transform(), attach_to=self._parent)
        # We need to pass the lambda a weak reference to self to avoid circular
        # reference.
        weak_self = weakref.ref(self)
        self.sensor.listen(lambda event: LaneInvasionSensor._on_invasion(weak_self, event))

    @staticmethod
    def _on_invasion(weak_self, event):
        """On invasion method"""
        self = weak_self()
        if not self:
            return
        lane_types = set(x.type for x in event.crossed_lane_markings)
        text = ['%r' % str(x).split()[-1] for x in lane_types]
        self.hud.notification('Crossed line %s' % ' and '.join(text))

        # Record any lane violations
        global GUI_lane_violation_count
        GUI_lane_violation_count += 1


# ==============================================================================
# -- GnssSensor --------------------------------------------------------
# ==============================================================================


class GnssSensor(object):
    """ Class for GNSS sensors"""

    def __init__(self, parent_actor):
        """Constructor method"""

        self.sensor = None
        self._parent = parent_actor
        self.lat = 0.0
        self.lon = 0.0
        world = self._parent.get_world()
        blueprint = world.get_blueprint_library().find('sensor.other.gnss')
        self.sensor = world.spawn_actor(blueprint, carla.Transform(carla.Location(x=1.0, z=2.8)),
                                        attach_to=self._parent)
        # We need to pass the lambda a weak reference to
        # self to avoid circular reference.
        weak_self = weakref.ref(self)
        self.sensor.listen(lambda event: GnssSensor._on_gnss_event(weak_self, event))

    @staticmethod
    def _on_gnss_event(weak_self, event):
        """GNSS method"""
        self = weak_self()
        if not self:
            return
        self.lat = event.latitude
        self.lon = event.longitude



# ==============================================================================
# -- CameraManager -------------------------------------------------------------
# ==============================================================================


class CameraManager(object):
    """ Class for camera management"""

    def __init__(self, parent_actor, hud):
        """Constructor method"""
        self.sensor = None
        self.surface = None
        self._parent = parent_actor
        self.hud = hud
        self.recording = False
        bound_y = 0.5 + self._parent.bounding_box.extent.y
        attachment = carla.AttachmentType
        self._camera_transforms = [
            (carla.Transform(
                carla.Location(x=-5.5, z=2.5), carla.Rotation(pitch=8.0)), attachment.SpringArm),
            (carla.Transform(
                carla.Location(x=1.6, z=1.7)), attachment.Rigid),
            (carla.Transform(
                carla.Location(x=5.5, y=1.5, z=1.5)), attachment.SpringArm),
            (carla.Transform(
                carla.Location(x=-8.0, z=6.0), carla.Rotation(pitch=6.0)), attachment.SpringArm),
            (carla.Transform(
                carla.Location(x=-1, y=-bound_y, z=0.5)), attachment.Rigid)]
        self.transform_index = 1
        self.sensors = [
            ['sensor.camera.rgb', cc.Raw, 'Camera RGB'],
            ['sensor.camera.depth', cc.Raw, 'Camera Depth (Raw)'],
            ['sensor.camera.depth', cc.Depth, 'Camera Depth (Gray Scale)'],
            ['sensor.camera.depth', cc.LogarithmicDepth, 'Camera Depth (Logarithmic Gray Scale)'],
            ['sensor.camera.semantic_segmentation', cc.Raw, 'Camera Semantic Segmentation (Raw)'],
            ['sensor.camera.semantic_segmentation', cc.CityScapesPalette,
             'Camera Semantic Segmentation (CityScapes Palette)'],
            ['sensor.lidar.ray_cast', None, 'Lidar (Ray-Cast)']]
        world = self._parent.get_world()
        bp_library = world.get_blueprint_library()
        for item in self.sensors:
            blp = bp_library.find(item[0])
            if item[0].startswith('sensor.camera'):
                blp.set_attribute('image_size_x', str(hud.dim[0]))
                blp.set_attribute('image_size_y', str(hud.dim[1]))
            elif item[0].startswith('sensor.lidar'):
                blp.set_attribute('range', '50')
            item.append(blp)
        self.index = None

    def toggle_camera(self):
        """Activate a camera"""
        self.transform_index = (self.transform_index + 1) % len(self._camera_transforms)
        self.set_sensor(self.index, notify=False, force_respawn=True)

    def set_sensor(self, index, notify=True, force_respawn=False):
        """Set a sensor"""
        index = index % len(self.sensors)
        needs_respawn = True if self.index is None else (
                force_respawn or (self.sensors[index][0] != self.sensors[self.index][0]))
        if needs_respawn:
            if self.sensor is not None:
                self.sensor.destroy()
                self.surface = None
            self.sensor = self._parent.get_world().spawn_actor(
                self.sensors[index][-1],
                self._camera_transforms[self.transform_index][0],
                attach_to=self._parent,
                attachment_type=self._camera_transforms[self.transform_index][1])

            # We need to pass the lambda a weak reference to
            # self to avoid circular reference.
            weak_self = weakref.ref(self)
            self.sensor.listen(lambda image: CameraManager._parse_image(weak_self, image))
        if notify:
            self.hud.notification(self.sensors[index][2])
        self.index = index

    def next_sensor(self):
        """Get the next sensor"""
        self.set_sensor(self.index + 1)

    def toggle_recording(self):
        """Toggle recording on or off"""
        self.recording = not self.recording
        self.hud.notification('Recording %s' % ('On' if self.recording else 'Off'))

    def render(self, display):
        """Render method"""
        if self.surface is not None:
            display.blit(self.surface, (0, 0))

    @staticmethod
    def _parse_image(weak_self, image):
        self = weak_self()
        if not self:
            return
        if self.sensors[self.index][0].startswith('sensor.lidar'):
            points = np.frombuffer(image.raw_data, dtype=np.dtype('f4'))
            points = np.reshape(points, (int(points.shape[0] / 4), 4))
            lidar_data = np.array(points[:, :2])
            lidar_data *= min(self.hud.dim) / 100.0
            lidar_data += (0.5 * self.hud.dim[0], 0.5 * self.hud.dim[1])
            lidar_data = np.fabs(lidar_data)  # pylint: disable=assignment-from-no-return
            lidar_data = lidar_data.astype(np.int32)
            lidar_data = np.reshape(lidar_data, (-1, 2))
            lidar_img_size = (self.hud.dim[0], self.hud.dim[1], 3)
            lidar_img = np.zeros(lidar_img_size)
            lidar_img[tuple(lidar_data.T)] = (255, 255, 255)
            self.surface = pygame.surfarray.make_surface(lidar_img)
        else:
            image.convert(self.sensors[self.index][1])
            array = np.frombuffer(image.raw_data, dtype=np.dtype("uint8"))
            array = np.reshape(array, (image.height, image.width, 4))
            array = array[:, :, :3]
            array = array[:, :, ::-1]
            self.surface = pygame.surfarray.make_surface(array.swapaxes(0, 1))
        if self.recording:
            image.save_to_disk('_out/%08d' % image.frame)


# ==============================================================================
# -- Game Loop ---------------------------------------------------------
# ==============================================================================


def game_loop(args):
    """
    Main loop of the simulation. It handles updating all the HUD information,
    ticking the agent and, if needed, the world.
    """

    pygame.init()
    pygame.font.init()
    world = None

    try:
        if args.seed:
            random.seed(args.seed)

        client = carla.Client(args.host, args.port)
        client.set_timeout(10.0)

        traffic_manager = client.get_trafficmanager()
        # for actor in my_vehicles:
        #     traffic_manager .update_vehicle_lights(actor, True)

        # client.start_recorder("/opt/carla-simulator/PythonAPI/examples/sensorData/recording.log", True)
        sim_world = client.get_world()

        #-----------------------------------------------------------------------------------------------

        # -------------
        # Spawn Walkers
        # -------------
        # some settings
        walkers_list = []
        all_id = []
        synchronous_master = False
        blueprintsWalkers = sim_world.get_blueprint_library().filter("walker.pedestrian.*")
        walker_controller_bp = sim_world.get_blueprint_library().find('controller.ai.walker')
        SpawnActor = carla.command.SpawnActor
        # SetAutopilot = carla.command.SetAutopilot
        # SetVehicleLightState = carla.command.SetVehicleLightState
        # FutureActor = carla.command.FutureActor
        percentagePedestriansRunning = 0.0  # how many pedestrians will run
        percentagePedestriansCrossing = 0.0  # how many pedestrians will walk through the road
        # 1. take all the random locations to spawn
        spawn_points = []
        for i in range(GUI_num_pedestrians):
            spawn_point = carla.Transform()
            loc = sim_world.get_random_location_from_navigation()
            if (loc != None):
                spawn_point.location = loc
                spawn_points.append(spawn_point)
        # 2. we spawn the walker object
        batch = []
        walker_speed = []
        for spawn_point in spawn_points:
            walker_bp = random.choice(blueprintsWalkers)
            # set as not invincible
            if walker_bp.has_attribute('is_invincible'):
                walker_bp.set_attribute('is_invincible', 'false')
            # set the max speed
            if walker_bp.has_attribute('speed'):
                if (random.random() > percentagePedestriansRunning):
                    # walking
                    walker_speed.append(walker_bp.get_attribute('speed').recommended_values[1])
                else:
                    # running
                    walker_speed.append(walker_bp.get_attribute('speed').recommended_values[2])
            else:
                print("Walker has no speed")
                walker_speed.append(0.0)
            batch.append(SpawnActor(walker_bp, spawn_point))
        results = client.apply_batch_sync(batch, True)
        walker_speed2 = []
        for i in range(len(results)):
            if results[i].error:
                logging.error(results[i].error)
            else:
                walkers_list.append({"id": results[i].actor_id})
                walker_speed2.append(walker_speed[i])
        walker_speed = walker_speed2
        # 3. we spawn the walker controller
        batch = []
        walker_controller_bp = sim_world.get_blueprint_library().find('controller.ai.walker')
        for i in range(len(walkers_list)):
            batch.append(SpawnActor(walker_controller_bp, carla.Transform(), walkers_list[i]["id"]))
        results = client.apply_batch_sync(batch, True)
        for i in range(len(results)):
            if results[i].error:
                logging.error(results[i].error)
            else:
                walkers_list[i]["con"] = results[i].actor_id
        # 4. we put together the walkers and controllers id to get the objects from their id
        for i in range(len(walkers_list)):
            all_id.append(walkers_list[i]["con"])
            all_id.append(walkers_list[i]["id"])
        all_actors = sim_world.get_actors(all_id)

        # wait for a tick to ensure client receives the last transform of the walkers we have just created
        if not synchronous_master:
            sim_world.wait_for_tick()
        else:
            sim_world.tick()

        # 5. initialize each controller and set target to walk to (list is [controler, actor, controller, actor ...])
        # set how many pedestrians can cross the road
        sim_world.set_pedestrians_cross_factor(percentagePedestriansCrossing)
        for i in range(0, len(all_id), 2):
            # start walker
            all_actors[i].start()
            # set walk to random point
            all_actors[i].go_to_location(sim_world.get_random_location_from_navigation())
            # max speed
            all_actors[i].set_max_speed(float(walker_speed[int(i / 2)]))

        print('Spawned %d Pedestrians.' % (len(walkers_list)))
        # walker_info = {
        #     'Number of Pedestrians' : len(walkers_list)
        # }
        # info.append(walker_info)

        #-------------------------------------------------------------------------------------------

        if args.sync:
            settings = sim_world.get_settings()
            settings.synchronous_mode = True
            settings.fixed_delta_seconds = 0.05
            sim_world.apply_settings(settings)

            traffic_manager.set_synchronous_mode(True)

        display = pygame.display.set_mode(
            (args.width, args.height),
            pygame.HWSURFACE | pygame.DOUBLEBUF)

        hud = HUD(args.width, args.height)
        world = World(client.get_world(), hud, args)
        controller = KeyboardControl(world)


        if args.agent == "Basic":
            agent = BasicAgent(world.player)
        else:
            agent = BehaviorAgent(world.player, behavior=args.behavior)

        get_destination =''
        get_origin1= ''
        print('Reading destination from trip id')
        tsql = "SELECT RideDestination, RideOrigin FROM VEHICLERIDEDETAILS WHERE RideID = ?;"
        with cursor.execute(tsql,args.trip_id):
            row = cursor.fetchone()
            get_destination = row[0]
            get_origin1 = row[1]
            while row:
                row = cursor.fetchone()


        print("Destination:", get_destination)

        if get_destination == "Santa Clara":
            x_loc_o = 53.8
            y_loc_o = 140.8
            x_loc_d = 53.8
            y_loc_d = 140.8
        elif get_destination == "San Francisco":
            x_loc_o = 110.5
            y_loc_o = 53.8
            x_loc_d = 110.5
            y_loc_d = 53.8
        elif get_destination == "Los Angeles":
            x_loc_o = -113.8
            y_loc_o = -27.4
            x_loc_d = -113.8
            y_loc_d = -27.4
        elif get_destination == "Las Gatos":
            x_loc_o = -52.6
            y_loc_o = 75.0
            x_loc_d = -52.6
            y_loc_d = 75.0
        elif get_destination == "San Jose":
            x_loc_o = -50.0
            y_loc_o = 27.0
            x_loc_d = -36.8
            y_loc_d = 127.8
        elif get_destination == "Fremont":
            x_loc_o = 44.4
            y_loc_o = 44.4
            x_loc_d = 44.4
            y_loc_d = 44.4

        # Set the agent destination
        spawn_points = world.map.get_spawn_points()
        spawn_point = random.choice(spawn_points)
        # destination = random.choice(spawn_points).location
        spawn_point.location.x = x_loc_d
        spawn_point.location.y = y_loc_d
        destination = spawn_point.location


        if get_origin1 == "Santa Clara":
            x1_loc_o = 53.8
            y1_loc_o = 140.8
            x1_loc_d = 53.8
            y1_loc_d = 140.8
        elif get_origin1 == "San Francisco":
            x1_loc_o = 110.5
            y1_loc_o = 53.8
            x1_loc_d = 110.5
            y1_loc_d = 53.8
        elif get_origin1 == "Los Angeles":
            x1_loc_o = -113.8
            y1_loc_o = -27.4
            x1_loc_d = -113.8
            y1_loc_d = -27.4
        elif get_origin1 == "Las Gatos":
            x1_loc_o = -52.6
            y1_loc_o = 75.0
            x1_loc_d = -52.6
            y1_loc_d = 75.0
        elif get_origin1 == "San Jose":
            x1_loc_o = -50.0
            y1_loc_o = 27.0
            x1_loc_d = -36.8
            y1_loc_d = 127.8
        elif get_origin1 == "Fremont":
            x1_loc_o = 44.4
            y1_loc_o = 44.4
            x1_loc_d = 44.4
            y1_loc_d = 44.4

        spawn_points1 = world.map.get_spawn_points()
        spawn_point1 = random.choice(spawn_points1) if spawn_points1 else carla.Transform()
        spawn_point1.location.x = x1_loc_d
        spawn_point1.location.y = y1_loc_d
        origin1 = spawn_point1.location

        # print('Swetha oriign ', origin1)
        # print('Swetha destination ', destination)
        agent.set_destination(destination)

        #-------------------------------------------------------------------------------------------------
        transform = world.player.get_transform()

        distance = compute_distance(transform.location, destination)
        print("Distance : ", distance)


        amap = world.world.get_map()

        sampling_resolution = 2
        grp = GlobalRoutePlanner(amap,sampling_resolution)
        # grp.setup()
        # spawn_points2 = world.get_map().get_spawn_points()
        a = carla.Location(origin1)
        b = carla.Location(destination)

        w1 = grp.trace_route(a, b)  # there are other funcations can be used to generate a route in GlobalRoutePlanner.
        i = 0
        # my_geolocation = map.transform_to_geolocation(transform)

        for w in w1:
            # text = "road id = %d, lane id = %d, transform = %s"
            # print(text % (w[0].road_id, w[0].lane_id, w[0].transform))
            routes = {
                'Ride ID' : args.trip_id,
                'Road ID' : w[0].road_id,
                'Lane ID' : w[0].lane_id,
                'Location x' : w[0].transform.location.x,
                'Location y' : w[0].transform.location.y
            }
            # waypoint02 = map.get_waypoint_xodr(w[0].road_id, w[0].lane_id, 10)
            # print(waypoint02)
            mark = str(w[0].lane_id)
            if i == 0:
                world.world.debug.draw_string(w[0].transform.location,  'OO', draw_shadow=False,
                                              color=carla.Color(r=0, g=255, b=255), life_time=120.0,
                                              persistent_lines=True)
            if i % 40 == 0:
                world.world.debug.draw_string(w[0].transform.location,'o' , draw_shadow=False,
                                        color=carla.Color(r=255, g=0, b=0), life_time=120.0,
                                        persistent_lines=True)
            else:
                world.world.debug.draw_string(w[0].transform.location, 'o', draw_shadow=False,
                                    color=carla.Color(r=0, g=0, b=255), life_time=1000.0,
                                    persistent_lines=True)

            # if i % 40 == 0:
            #     world.world.debug.draw_string(w[0].transform.location, 'O', draw_shadow=False,
            #                             color=carla.Color(r=255, g=0, b=0), life_time=120.0,
            #                             persistent_lines=True)
            # else:
            #     world.world.debug.draw_string(w[0].transform.location, 'O', draw_shadow=False,
            #                         color=carla.Color(r=0, g=0, b=255), life_time=1000.0,
            #                         persistent_lines=True)
            route_info.append(routes)
            i += 1




        #------------------------------------------------------------------------------------------------





        clock = pygame.time.Clock()

        tsql = "UPDATE VEHICLERIDEDETAILS SET RideStatus = ? , RideStartTime = GETDATE() WHERE RideID = ?"
        with cursor.execute(tsql, 'In Progress', args.trip_id):
            print('Successfully Updated Ride details to in Progress !')

        while True:
            clock.tick()
            if args.sync:
                world.world.tick()

            else:
                world.world.wait_for_tick()

            if controller.parse_events():
                return

            world.tick(clock)
            world.render(display)

            pygame.display.flip()


            if agent.done():
                if args.loop:
                    agent.set_destination(random.choice(spawn_points).location)
                    world.hud.notification("The target has been reached, searching for another target", seconds=4.0)
                    print("The target has been reached, searching for another target")
                else:

                    tsql = "UPDATE VEHICLERIDEDETAILS SET RideStatus = ?, RideDistance = ?, RideEndTime = GETDATE() WHERE RideID = ?"
                    with cursor.execute(tsql, 'Completed',distance, args.trip_id):
                        print('Successfully Updated Ride details to completed!')
                    print("The target has been reached, stopping the simulation")
                    break

            # sen_main()

            control = agent.run_step()
            control.manual_gear_shift = False
            world.player.apply_control(control)

    finally:
        # client.stop_recorder()
        write_to_db(info)
        write_to_routedb(route_info)

        if world is not None:
            settings = world.world.get_settings()
            settings.synchronous_mode = False
            settings.fixed_delta_seconds = None
            world.world.apply_settings(settings)
            traffic_manager.set_synchronous_mode(True)

            world.destroy()

        pygame.quit()


# def write_to_db(info,route_info):
#     # client = MongoClient("mongodb+srv://tarnjit458:tarnjit458@cluster0.myihu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
#     client = MongoClient(
#         "mongodb+srv://admin:Swetha12345@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority")
#     db = client.get_database('AVCLOUD')
#     # print(client.list_database_names())
#     records = db.SensorData
#     records.delete_many({})
#     records.insert_many(info)
#
#     route_records = db.RouteInfo
#     route_records.delete_many({})
#     route_records.insert_many(route_info)

def write_to_db(info):

    client = MongoClient(
        "mongodb+srv://admin:Swetha12345@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority")
    db = client.get_database('AVCLOUD')
    # print(client.list_database_names())
    records = db.SensorData
    records.delete_many({})
    # records.insert_one(info)
    records.insert_many(info)



def write_to_routedb(route_info):
    client = MongoClient(
        "mongodb+srv://admin:Swetha12345@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority")
    db = client.get_database('AVCLOUD')
    # print(client.list_database_names())
    # route_records = db.RouteInfo
    # # route_records.delete_many({})
    # route_records.insert_one(route_info)
    route_records = db.RouteInfo
    route_records.delete_many({})
    route_records.insert_many(route_info)

# def clear_to_db():
#     # client = MongoClient("mongodb+srv://tarnjit458:tarnjit458@cluster0.myihu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
#     client = MongoClient(
#         "mongodb+srv://admin:Swetha12345@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority")
#     db = client.get_database('AVCLOUD')
#     # print(client.list_database_names())
#     records = db.SensorData
#     records.delete_many({})
#     route_records = db.RouteInfo
#     route_records.delete_many({})



# ==============================================================================
# -- main() --------------------------------------------------------------
# ==============================================================================

class Main(object):


    def setupUi(self, MainWindow):
        # write_to_db()
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(800, 750)
        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")

        self.label = QtWidgets.QLabel(self.centralwidget)
        # self.label.setGeometry(QtCore.QRect(270, 110, 251, 71))
        self.label.setGeometry(QtCore.QRect(0, 10, 800, 50))
        font = QtGui.QFont()
        font.setBold(True)
        font.setUnderline(True)
        font.setPointSize(28)
        self.label.setFont(font)
        self.label.setAlignment(QtCore.Qt.AlignCenter)
        self.label.setObjectName("label")

        # self.line = QtWidgets.QFrame(self.centralwidget)
        # self.line.setObjectName("line")
        # self.line.setGeometry(QtCore.QRect(230, 90, 20, 391))
        # self.line.setFrameShape(QtWidgets.QFrame.VLine)
        # self.line.setFrameShadow(QtWidgets.QFrame.Sunken)
        # self.line_2 = QtWidgets.QFrame(self.centralwidget)
        # self.line_2.setObjectName("line_2")
        # self.line_2.setGeometry(QtCore.QRect(560, 90, 20, 391))
        # self.line_2.setFrameShape(QtWidgets.QFrame.VLine)
        # self.line_2.setFrameShadow(QtWidgets.QFrame.Sunken)

        self.label_clogo = QtWidgets.QLabel(self.centralwidget)
        # self.label_clogo.setStyleSheet("background-image: url('/opt/carla-simulator/PythonAPI/examples/images/Carla.png') ; background-attachment: fixed")
        # self.label_clogo.setGeometry(QtCore.QRect(30, 30, 320, 30))
        # self.label_clogo.setPixmap(QtGui.QPixmap('/opt/carla-simulator/PythonAPI/examples/images/Carla.png'))
        # self.label_clogo = QtWidgets.QLabel(self.centralwidget)
        # self.label_clogo.setGeometry(QtCore.QRect(50, 80, 80, 200))
        # self.label_clogo.setPixmap(QtGui.QPixmap('/opt/carla-simulator/PythonAPI/examples/images/Carla.png'))

        self.car_label = QtWidgets.QLabel(self.centralwidget)
        self.car_label.setGeometry(QtCore.QRect(100, 330, 750, 600))
        self.car_label.setObjectName("car_label")
        self.movie = QtGui.QMovie('/opt/carla-simulator/PythonAPI/examples/images/carla.gif')
        self.car_label.setMovie(self.movie)
        self.movie.start()

        self.comboBox = QtWidgets.QComboBox(self.centralwidget)
        self.comboBox.addItem("")
        self.comboBox.addItem("")
        self.comboBox.addItem("")
        self.comboBox.setObjectName("comboBox")
        self.comboBox.setGeometry(QtCore.QRect(380, 100, 151, 22))
        self.comboBox_2 = QtWidgets.QComboBox(self.centralwidget)
        self.comboBox_2.addItem("")
        self.comboBox_2.addItem("")
        self.comboBox_2.addItem("")
        self.comboBox_2.addItem("")
        self.comboBox_2.addItem("")
        self.comboBox_2.setObjectName("comboBox_2")
        self.comboBox_2.setGeometry(QtCore.QRect(380, 160, 151, 22))
        self.comboBox_3 = QtWidgets.QComboBox(self.centralwidget)
        self.comboBox_3.addItem("Tesla Model 3", "model3")
        self.comboBox_3.addItem("Tesla Cybertruck", "cybertruck")
        self.comboBox_3.addItem("Mustang", "mustang")
        self.comboBox_3.addItem("Jeep Wrangler", "jeep")
        self.comboBox_3.addItem("BMW Grandtourer", "bmw")
        self.comboBox_3.addItem("Volkswagen T2", "volkswagen")
        self.comboBox_3.addItem("Lincoln Mkz2017", "lincoln")
        # self.comboBox_3.addItem("Harley Davidson", "harley-davidson")
        self.comboBox_3.addItem("Audi A2", "audi")
        self.comboBox_3.addItem("Citroen C3", "citroen")
        # self.comboBox_3.addItem("Mercedes Benz coupe", "mercedes-benz")
        self.comboBox_3.addItem("Toyota Prius", "prius")
        self.comboBox_3.addItem("Dodge Charger 2020", "charger2020")
        self.comboBox_3.addItem("Mini Cooper", "mini")
        self.comboBox_3.addItem("Chevorlet Impala", "impala")
        self.comboBox_3.addItem("Carlamotors CarlaCola", "carlamotors")

        self.comboBox_3.setObjectName("comboBox_3")
        self.comboBox_3.setGeometry(QtCore.QRect(380, 220, 151, 22))

        # self.comboBox_4 = QtWidgets.QComboBox(self.centralwidget)
        # self.comboBox_4.addItem("Normal", "normal")
        # self.comboBox_4.addItem("Cautious", "cautious")
        # self.comboBox_4.addItem("Aggressive", "aggressive")
        # self.comboBox_4.setObjectName("comboBox_4")
        # self.comboBox_4.setGeometry(QtCore.QRect(380, 280, 151, 22))
        self.spinbox = QtWidgets.QSpinBox(self.centralwidget)
        self.spinbox.setObjectName("spinbox")
        self.spinbox.setGeometry(QtCore.QRect(500, 280, 50, 22))
        self.spinbox.setMaximum(50)

        self.spinbox1 = QtWidgets.QSpinBox(self.centralwidget)
        self.spinbox1.setObjectName("spinbox1")
        self.spinbox1.setGeometry(QtCore.QRect(470, 340, 50, 22))
        self.spinbox1.setMaximum(50)

        font1 = QtGui.QFont()
        font1.setPointSize(12)
        font1.setBold(True)
        font1.setWeight(75)
        self.label_2 = QtWidgets.QLabel(self.centralwidget)
        self.label_2.setObjectName("label_2")
        self.label_2.setGeometry(QtCore.QRect(280, 100, 81, 20))
        self.label_2.setFont(font1)
        self.label_3 = QtWidgets.QLabel(self.centralwidget)
        self.label_3.setObjectName("label_3")
        self.label_3.setGeometry(QtCore.QRect(280, 160, 81, 20))
        self.label_3.setFont(font1)
        self.label_4 = QtWidgets.QLabel(self.centralwidget)
        self.label_4.setObjectName("label_4")
        self.label_4.setGeometry(QtCore.QRect(280, 220, 71, 20))
        self.label_4.setFont(font1)
        self.label_5 = QtWidgets.QLabel(self.centralwidget)
        self.label_5.setObjectName("label_5")
        self.label_5.setGeometry(QtCore.QRect(280, 280, 220, 20))
        self.label_5.setFont(font1)
        self.label_6 = QtWidgets.QLabel(self.centralwidget)
        self.label_6.setObjectName("label_6")
        self.label_6.setGeometry(QtCore.QRect(280, 340, 200, 20))
        self.label_6.setFont(font1)

        self.pushButton = QtWidgets.QPushButton(self.centralwidget)
        self.pushButton.setGeometry(QtCore.QRect(320, 400, 160, 38))
        self.pushButton.setObjectName("pushButton")
        self.pushButton.setAutoFillBackground(False)
        self.pushButton.setAutoDefault(True)
        self.pushButton.setFlat(False)
        self.pushButton.setStyleSheet("background-color : #034672")
        self.pushButton.clicked.connect(self.mainMethod)

        MainWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 800, 26))
        self.menubar.setObjectName("menubar")
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QtWidgets.QStatusBar(MainWindow)
        self.statusbar.setObjectName("statusbar")
        MainWindow.setStatusBar(self.statusbar)


        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "CARLA GUI Editor"))
        self.label.setText(_translate("MainWindow", "Autonomous Car Rental Services"))
        self.label_2.setText(_translate("MainWindow", "Lighting"))
        self.label_3.setText(_translate("MainWindow", "Weather"))
        self.label_4.setText(_translate("MainWindow", "Vehicle"))
        self.label_5.setText(_translate("MainWindow", "Number of Pedestrians"))
        self.label_6.setText(_translate("MainWindow", "Number of Vehicles"))
        self.comboBox.setItemText(0, QtCore.QCoreApplication.translate("MainWindow", "Day", None))
        self.comboBox.setItemText(1, QtCore.QCoreApplication.translate("MainWindow", "Midday", None))
        self.comboBox.setItemText(2, QtCore.QCoreApplication.translate("MainWindow", "Night", None))
        self.comboBox_2.setItemText(0, QtCore.QCoreApplication.translate("MainWindow", "Clear", None))
        self.comboBox_2.setItemText(1, QtCore.QCoreApplication.translate("MainWindow", "Cloudy", None))
        self.comboBox_2.setItemText(2, QtCore.QCoreApplication.translate("MainWindow", "Rain", None))
        self.comboBox_2.setItemText(3, QtCore.QCoreApplication.translate("MainWindow", "Foggy", None))
        self.comboBox_2.setItemText(4, QtCore.QCoreApplication.translate("MainWindow", "Windy", None))

        self.pushButton.setText(_translate("MainWindow", "Start Simulation"))

    def mainMethod(self):
        """Main method"""



        argparser = argparse.ArgumentParser(
            description='CARLA Automatic Control Client')
        argparser.add_argument(
            '-v', '--verbose',
            action='store_true',
            dest='debug',
            help='Print debug information')
        argparser.add_argument("--destination", type=str,
                               help="destination",
                               default="Santa Clara")
        argparser.add_argument("--trip_id", type=int,
                               help="tripId",
                               default="555")
        argparser.add_argument(
            '--host',
            metavar='H',
            default='127.0.0.1',
            help='IP of the host server (default: 127.0.0.1)')
        argparser.add_argument(
            '-p', '--port',
            metavar='P',
            default=2000,
            type=int,
            help='TCP port to listen to (default: 2000)')
        argparser.add_argument(
            '--res',
            metavar='WIDTHxHEIGHT',
            default='1280x720',
            help='Window resolution (default: 1280x720)')
        argparser.add_argument(
            '--sync',
            action='store_true',
            help='Synchronous mode execution')
        argparser.add_argument(
            '--filter',
            metavar='PATTERN',
            default='vehicle.*',
            help='Actor filter (default: "vehicle.*")')
        argparser.add_argument(
            '-l', '--loop',
            action='store_true',
            dest='loop',
            help='Sets a new random destination upon reaching the previous one (default: False)')
        argparser.add_argument(
            "-a", "--agent", type=str,
            choices=["Behavior", "Basic"],
            help="select which agent to run",
            default="Behavior")
        argparser.add_argument(
            '-b', '--behavior', type=str,
            choices=["cautious", "normal", "aggressive"],
            help='Choose one of the possible agent behaviors (default: normal) ',
            default='normal')
        argparser.add_argument(
            '-s', '--seed',
            help='Set seed for repeating executions (default: None)',
            default=None,
            type=int)

        args = argparser.parse_args()

        args.width, args.height = [int(x) for x in args.res.split('x')]

        # Assign global values for GUI parameters
        global GUI_lighting
        global GUI_weather
        global GUI_vehicle
        global GUI_num_pedestrians
        global GUI_num_vehicles
        global GUI_trip_id

        GUI_lighting = self.comboBox.currentText()
        GUI_weather = self.comboBox_2.currentText()
        GUI_vehicle = self.comboBox_3.currentData()
        # GUI_behavior = self.comboBox_4.currentData()
        GUI_num_pedestrians = self.spinbox.value()
        GUI_num_vehicles = self.spinbox1.value()
        GUI_trip_id = args.trip_id
        # print("Destination : ",args.destination)
        print("Lighting: " +GUI_lighting + " Weather: " + GUI_weather + " Vehicle: "+ GUI_vehicle)

        log_level = logging.DEBUG if args.debug else logging.INFO
        logging.basicConfig(format='%(levelname)s: %(message)s', level=log_level)

        # logging.info('listening to server %s:%s', args.host, args.port)

        print(__doc__)

        try:
            game_loop(args)
            print(" im here in game loop ")
            # carlaProcess.kill()
            # os.kill(carlaProcess.pid, -9)
            # p = psutil.Process(carlaProcess.pid)
            # p.terminate()
            # os.killpg(os.getpgid(carlaProcess.pid), signal.SIGTERM)
            sys.exit()

        except KeyboardInterrupt:
            print('\nCancelled by user. Bye!')

# stylesheet = """
#             QMainWindow {
#                 background-image: url('/opt/carla-simulator/PythonAPI/examples/images/Carla.png');
#                 background-color : rgba(0, 0, 0, 0);
#                 background-repeat: no-repeat;
#                 background-position: center;
#             }
#         """
if __name__ == '__main__':
    # main()
    carlaProcess = subprocess.Popen("/opt/carla-simulator/CarlaUE4.sh")
    time.sleep(8)
    app = QtWidgets.QApplication(sys.argv)
    # app.setStyleSheet(stylesheet)
    MainWindow = QtWidgets.QMainWindow()
    ui = Main()
    ui.setupUi(MainWindow)
    MainWindow.show()
    # sys.exit(app.exec_())
    appProcess = app.exec_()
    print(" im here also after apprpocess")

    # os.killpg(os.getpgid(carlaProcess.pid), signal.SIGTERM)
    print(" im here also")
    # sys.exit()

    # appProcess = app.exec_()
    # print(" im here ")
    # # appProcess.quit()
    # print(" im here ")
    # # appProcess.kill()
    # # carlaProcess.kill()
    # print(" im here also")
    # sys.exit()
