import numpy as np
from tqdm import tqdm
from scipy.signal import butter, lfilter
from scipy.interpolate import griddata
from soundfile import read
from pydub import AudioSegment
from tempfile import mkstemp
import os
import webbrowser
import tkinter as tk
from functools import partial
from tkinter import filedialog

def butter_bandpass(lowcut, highcut, fs, order=5):
	nyq = 0.5 * fs
	low = lowcut / nyq
	high = highcut / nyq
	b, a = butter(order, [low, high], btype='band')
	return b, a


def butter_bandpass_filter(data, lowcut, highcut, fs, order=5):
	b, a = butter_bandpass(lowcut, highcut, fs, order=order)
	y = lfilter(b, a, data)
	return y


def isNaN(num):
	return num != num


def build_song_data(mp3_path, path):
	# Initialization
	print("\nAnalyzing Audio (1 of 2)...")

	mp3 = AudioSegment.from_mp3(mp3_path)
	mp3.export(path + "song.mp3", format="mp3")
	_, temp_path = mkstemp()
	mp3.export(temp_path + "song.wav", format="wav")

	audio, fs = read(temp_path + "song.wav")
	if audio.ndim == 2:
		audio = audio[:, 0]  # Keep only left channel

	# Parameters
	win_length_time = 0.07

	n_bands = 5
	bands_borders = np.array([20, 140, 700, 2500, 10000, 20000])
	first_mid_band = 1
	first_high_band = 4

	upsample_freq = 5
	upsample_time = 5

	sanity_ground = 1.3
	sanity_lights = 1.9

	max_vertices_per_block = 16000

	# program
	win_length_samples = int(win_length_time * fs)
	n_frames = int(len(audio) / win_length_samples) - 1
	z_init_matrix = np.zeros((n_frames, n_bands))

	for f in tqdm(range(n_frames)):
		frame = audio[(f * win_length_samples): np.min([f * win_length_samples + win_length_samples, len(audio)])]
		for b in range(n_bands):
			lowcut = bands_borders[b]
			highcut = bands_borders[b + 1]
			filtered_frame = butter_bandpass_filter(frame, lowcut, highcut, fs, 3)
			rms = np.sqrt(sum(np.power(filtered_frame, 2)))
			z_init_matrix[f, b] = rms
	for b in range(n_bands):
		z_init_matrix[:, b] = np.power(z_init_matrix[:, b] / z_init_matrix[:, b].max() / 0.85, sanity_ground)
		for f in range(n_frames):
			z_init_matrix[f, b] = min([z_init_matrix[f, b], 1])

	# interpolate
	grid_x, grid_y = np.mgrid[0: 1.0000000001: 1.0 / ((n_frames - 1) * upsample_time),
						  0:1.0000000001:1.0 / ((n_bands - 1) * upsample_freq)]
	data_values = z_init_matrix.reshape(-1, 1)
	range_x = np.arange(0, 1.0000000001, 1 / (n_frames - 1))
	range_y = np.arange(0, 1.0000000001, 1 / (n_bands - 1))
	data_points = np.zeros((len(data_values), 2))
	print("\nComputing surface (2 of 2)...")
	for i in range(len(range_x)):
		for j in range(len(range_y)):
			data_points[i * len(range_y) + j, 0] = range_x[i]
			data_points[i * len(range_y) + j, 1] = range_y[j]
	interp_data = griddata(data_points, data_values, (grid_x, grid_y), method='cubic')
	interp_data = interp_data[:interp_data.shape[0] - 1, :, 0]

	n_rows = interp_data.shape[0]
	n_vertex_per_row = interp_data.shape[1]
	song_duration_seconds = win_length_time * (n_frames-1)
	vertex_sample_rate = (n_rows) / song_duration_seconds

	for i in range(n_rows):
		for j in range(n_vertex_per_row):
			if isNaN(interp_data[i][j]):
				interp_data[i][j] = 0.0

	# bass, mid, high
	bass_data = np.zeros((n_rows,))
	mid_data = np.zeros((n_rows,))
	high_data = np.zeros((n_rows,))
	for i in range(n_rows):
		for j in range(n_vertex_per_row):
			if j < first_mid_band * upsample_freq:
				bass_data[i] += interp_data[i, j]
			elif j < first_high_band * upsample_freq:
				mid_data[i] += interp_data[i, j]
			else:
				high_data[i] += interp_data[i, j]
	bass_mid_high_data = np.zeros((n_rows, 3))
	bass_mid_high_data[:, 0] = np.power(np.absolute(bass_data) / bass_data.max(), sanity_lights)
	bass_mid_high_data[:, 1] = np.power(np.absolute(mid_data) / mid_data.max(), sanity_lights)
	bass_mid_high_data[:, 2] = np.power(np.absolute(high_data) / high_data.max(), sanity_lights)

	# compute vertices, indices and normals
	current_block = 0
	vertices = "var audio_ground_vert = [];\naudio_ground_vert[{0:d}] = [".format(current_block)
	indices = "var audio_ground_ind = [];\naudio_ground_ind[{0:d}] = [".format(current_block)
	normals = "var audio_ground_norm = [];\naudio_ground_norm[{0:d}] = [".format(current_block)
	current_vertex = 0
	n_vert = n_rows * n_vertex_per_row
	is_last_block_row = False
	is_last_row = False
	last_row_vertices = ""
	last_row_normals = ""
	past_blocks_vertices = 0
	for i in tqdm(range(n_rows)):
		for j in range(n_vertex_per_row):
			current_vertex = i * n_vertex_per_row + j
			# vertex
			vertices += "{0:.7f}, {1:.7f}, {2:.7f}".format(
				grid_y[0, j] - 0.5, interp_data[i, j], -grid_x[i, 0] * song_duration_seconds)
			if is_last_block_row:
				last_row_vertices += "{0:.7f}, {1:.7f}, {2:.7f}".format(
					grid_y[0, j] - 0.5, interp_data[i, j], -grid_x[i, 0] * song_duration_seconds)
			if j != n_vertex_per_row - 1:
				vertices += ","
				if is_last_block_row:
					last_row_vertices += ","
			# index
			if (not is_last_row) & (j != n_vertex_per_row - 1):
				indices += " {0:d}, {1:d}, {2:d},".format(
					current_vertex - past_blocks_vertices,
					current_vertex - past_blocks_vertices + 1,
					current_vertex - past_blocks_vertices + n_vertex_per_row)
				indices += " {0:d}, {1:d}, {2:d}".format(
					current_vertex - past_blocks_vertices + n_vertex_per_row,
					current_vertex - past_blocks_vertices + 1,
					current_vertex - past_blocks_vertices + n_vertex_per_row + 1)
				if j != n_vertex_per_row - 2:
					indices += ","
			# normal
			left = np.array([0, 0, 0])
			left2 = np.array([0, 0, 0])
			forth = np.array([0, 0, 0])
			forth2 = np.array([0, 0, 0])
			if i != 0:
				forth = np.array([0, grid_x[1, 1] * song_duration_seconds, interp_data[i, j] - interp_data[i - 1, j]])
			if i != n_rows - 1:
				forth2 = np.array([0, grid_x[1, 1] * song_duration_seconds, interp_data[i + 1, j] - interp_data[i, j]])
			if j != 0:
				left = np.array([-grid_y[1, 1], 0, interp_data[i, j - 1] - interp_data[i, j]])
			if j != n_vertex_per_row - 1:
				left2 = np.array([-grid_y[1, 1], 0, interp_data[i, j] - interp_data[i, j + 1]])
			left = left + left2
			forth = forth + forth2
			normal = np.cross(forth, left)
			normal = normal / np.linalg.norm(normal)
			normals += " {0:.5f}, {1:.5f}, {2:.5f}".format(normal[0], normal[2], -normal[1])
			if is_last_block_row:
				last_row_normals += " {0:.5f}, {1:.5f}, {2:.5f}".format(normal[0], normal[2], -normal[1])
			if j != n_vertex_per_row - 1:
				normals += ","
				if is_last_block_row:
					last_row_normals += ","
		if is_last_block_row:
			is_last_block_row = False
			if not is_last_row:
				vertices += " ];\naudio_ground_vert[{0:d}] = [ {1:s} ".format(current_block, last_row_vertices)
				normals += " ];\naudio_ground_norm[{0:d}] = [ {1:s} ".format(current_block, last_row_normals)
				last_row_vertices = ""
				last_row_normals = ""
				indices += ","
				vertices += ","
				normals += ","
			else:
				vertices += " ];\n"
				normals += " ];\n"
		elif i == n_rows - 2:
			is_last_row = True
			is_last_block_row = True
			indices += " ];\n"
			vertices += ","
			normals += ","
		elif current_vertex - past_blocks_vertices > max_vertices_per_block:  # block size exceeded
			is_last_block_row = True
			current_block += 1
			indices += " ];\naudio_ground_ind[{0:d}] = [ ".format(current_block)
			vertices += ","
			normals += ","
			past_blocks_vertices = current_vertex + 1
		else:
			vertices += ","
			normals += ","
			indices += ","

	info = "\nvar n_vertex_per_row = {0:d};".format(n_vertex_per_row)
	info += "\nvar n_rows = {0:d};".format(n_rows)
	info += "\nvar n_vertex = {0:d};".format(n_rows * n_vertex_per_row)
	info += "\nvar y_map = [[ "
	for i in range(n_rows):
		for j in range(n_vertex_per_row):
			info += "{0:.6f}".format(interp_data[i][j])
			if j != n_vertex_per_row - 1:
				info += ", "
		if i != n_rows - 1:
			info += "], ["
		else:
			info += "]];\n"
	info += "\nvar song_duration_seconds = {0:.4f};".format(song_duration_seconds)
	info += "\nvar vertex_sample_rate = {0:.6f};".format(vertex_sample_rate)

	pattern_bass = "\nvar pattern_bass = [ "
	pattern_mid = "\nvar pattern_mid = [ "
	pattern_high = "\nvar pattern_high = [ "
	for i in range(n_rows):
		pattern_bass += "{0:.7f}".format(bass_mid_high_data[i, 0])
		pattern_mid += "{0:.7f}".format(bass_mid_high_data[i, 1])
		pattern_high += "{0:.7f}".format(bass_mid_high_data[i, 2])
		if not (i == n_rows - 1):
			pattern_bass += ", "
			pattern_mid += ", "
			pattern_high += ", "
		else:
			pattern_bass += "];"
			pattern_mid += "];"
			pattern_high += "];"

	# items position
	start = 0  # vertex to start on
	stop = 0  # stop before n vertices

	# Level 0: on ground
	items_0_rows_space = upsample_time * 6
	items_00 = "\nvar items_00 = ["
	pos_x = 0
	vel_x = 0
	vel_x_max = 0.3
	pos_x_max = 0.45
	v = start
	while v < n_rows - stop:
		vel_x += (np.random.rand() - 0.5) * 0.2
		if vel_x > vel_x_max:
			vel_x = vel_x_max
		elif vel_x < -vel_x_max:
			vel_x = -vel_x_max
		pos_x += vel_x
		if pos_x > pos_x_max:
			pos_x = pos_x_max
			vel_x = 0
		elif pos_x < -pos_x_max:
			pos_x = -pos_x_max
			vel_x = 0
		x_index = int((pos_x + 0.5) * n_vertex_per_row)
		items_00 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(
			pos_x, interp_data[v][x_index] + 0.2, -v / vertex_sample_rate)
		v += items_0_rows_space
		if v < n_rows - stop:
			items_00 += ", "
	items_00 += "];"

	# lv 1, 2, 3
	items_123_rows_space = upsample_time * 8
	# probabilities
	item_lv1_prob = 0.4
	item_lv2_prob = 0.4
	item_lv3_prob = 0.2
	lv1_mean = 2
	lv1_dev = 0.15
	lv2_mean = 4
	lv2_dev = 0.15
	lv3_mean = 6
	lv3_dev = 0.15

	# lv 1
	items_10_prob = 0.5
	items_10 = "\nvar items_10 = [ "
	items_11_prob = 0.25
	items_11 = "\nvar items_11 = [ "
	items_12_prob = 0.25
	items_12 = "\nvar items_12 = [ "
	# lv 2
	items_20_prob = 0.3
	items_20 = "\nvar items_20 = [ "
	items_21_prob = 0.3
	items_21 = "\nvar items_21 = [ "
	items_22_prob = 0.4
	items_22 = "\nvar items_22 = [ "
	# lv 3
	items_30_prob = 0.7
	items_30 = "\nvar items_30 = [ "
	items_31_prob = 0.2
	items_31 = "\nvar items_31 = [ "
	items_32_prob = 0.1
	items_32 = "\nvar items_32 = [ "

	v = start
	while v < n_rows - stop:
		lv = np.random.rand()
		pos_x = np.random.rand() * 0.95 - 0.475
		pos_z = -v / vertex_sample_rate
		if lv < item_lv1_prob:  # lv 1
			pos_y = np.max([np.random.randn() * lv1_dev + lv1_mean, 1])
			n = np.random.rand()
			if n < items_10_prob:
				items_10 += "[{0:.6f}, {1:.6f}, {2:.6f}],".format(pos_x, pos_y, pos_z)
			elif n < items_10_prob + items_11_prob:
				items_11 += "[{0:.6f}, {1:.6f}, {2:.6f}],".format(pos_x, pos_y, pos_z)
			elif n < items_10_prob + items_11_prob + items_12_prob:
				items_12 += "[{0:.6f}, {1:.6f}, {2:.6f}],".format(pos_x, pos_y, pos_z)

		elif lv < item_lv1_prob + item_lv2_prob:  # lv 2
			pos_y = np.max([np.random.randn() * lv2_dev + lv2_mean, 1])
			n = np.random.rand()
			if n < items_20_prob:
				items_20 += "[{0:.6f}, {1:.6f}, {2:.6f}],".format(pos_x, pos_y, pos_z)
			elif n < items_20_prob + items_21_prob:
				items_21 += "[{0:.6f}, {1:.6f}, {2:.6f}],".format(pos_x, pos_y, pos_z)
			elif n < items_20_prob + items_21_prob + items_22_prob:
				items_22 += "[{0:.6f}, {1:.6f}, {2:.6f}],".format(pos_x, pos_y, pos_z)

		else:  # lv 3
			pos_y = np.max([np.random.randn() * lv3_dev + lv3_mean, 1])
			n = np.random.rand()
			if n < items_30_prob:
				items_30 += "[{0:.6f}, {1:.6f}, {2:.6f}],".format(pos_x, pos_y, pos_z)
			elif n < items_30_prob + items_31_prob:
				items_31 += "[{0:.6f}, {1:.6f}, {2:.6f}],".format(pos_x, pos_y, pos_z)
			elif n < items_30_prob + items_31_prob + items_32_prob:
				items_32 += "[{0:.6f}, {1:.6f}, {2:.6f}],".format(pos_x, pos_y, pos_z)
		v += items_123_rows_space

	items_10 = items_10[:-1] + "];"
	items_11 = items_11[:-1] + "];"
	items_12 = items_12[:-1] + "];"
	items_20 = items_20[:-1] + "];"
	items_21 = items_21[:-1] + "];"
	items_22 = items_22[:-1] + "];"
	items_30 = items_30[:-1] + "];"
	items_31 = items_31[:-1] + "];"
	items_32 = items_32[:-1] + "];"

	song_data = vertices + indices + normals + info
	song_data += pattern_bass + pattern_mid + pattern_high
	song_data += items_00
	song_data += items_10 + items_11 + items_12
	song_data += items_20 + items_21 + items_22
	song_data += items_30 + items_31 + items_32

	# Write files
	file = open("{0:s}/song_data.js".format(path), "w")
	file.write(song_data)
	print("\nDone!\n")


def build_html(path):
	f = open('empty_page.txt', 'r')
	page = f.read()
	html = page.format(path.split("/")[1])
	file = open(os.path.join("..", "{0:s}.html".format(path.split("/")[1])), "w")
	file.write(html)


def open_song(path):
	parent = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
	url = "file://" + parent + "/{0:s}.html".format(path.split("/")[1])
	webbrowser.open(url, new=2)


def load_song(mp3_path, song_data_path):
	song_data_path = os.path.join(os.getcwd(), '..', song_data_path)
	if not os.path.exists(song_data_path):
		os.mkdir(song_data_path)
	build_song_data(mp3_path, song_data_path)
	build_html(song_data_path)


class App:
	def __init__(self, master):
		self.master = master
		self.frame = tk.Frame(self.master)
		self.frame.pack()
		self.reload()
		self.master.title("Spectrum Rider")
		self.master.geometry('400x600')

	def open_new_song_screen(self):
		self.newWindow = tk.Toplevel(self.master)
		self.app = New_song(self.newWindow, self)

	def reload(self):
		if self.frame:
			self.frame.pack_forget()
		self.frame = tk.Frame(self.master)
		self.frame.pack()
		folders = [f for f in os.listdir(os.path.join(os.getcwd(), '..', 'SONGDATA'))]
		labels = []
		play_buttons = []
		frames = []

		new_song_button = tk.Button(self.frame, text="New Song", command=self.open_new_song_screen)
		new_song_button.pack()

		for i in range(len(folders)):
			frames.append(tk.Frame(self.frame, width=300, height=100))
			frames[i].pack()

			labels.append(tk.Label(frames[i], text=folders[i]))
			labels[i].pack(fill=tk.Y, side=tk.LEFT)

			play_buttons.append(tk.Button(frames[i], text="Play", command=partial(open_song, "SONGDATA/" + folders[i])))
			play_buttons[i].pack(fill=tk.Y, side=tk.LEFT)


class New_song:
	def __init__(self, master, root):
		self.filename = "No file selected!"
		self.message = "Loading a song will take some minutes, please wait..."
		self.artist = ""
		self.title = ""

		self.master = master
		self.master.title("New Song")
		self.master.geometry('500x500')
		self.root = root
		self.frame = tk.Frame(self.master)
		self.frame.pack()

		self.reload()

	def close_window(self):
		self.master.destroy()

	def load_song(self):
		self.artist = self.artist_entry.get()
		self.title = self.title_entry.get()
		if not (self.filename == "No file selected!" or self.artist == "" or self.title == ""):
			load_song(self.filename, "SONGDATA/" + self.artist + " - " + self.title + "/")
			self.root.reload()
			self.close_window()
		else:
			self.message = "ERROR: please, upload an mp3 file and enter artist and song name!"
			self.reload()

	def upload_file(self):
		self.filename = filedialog.askopenfilename()
		self.reload()

	def reload(self):
		if self.frame:
			self.frame.pack_forget()
		self.frame = tk.Frame(self.master)
		self.frame.pack()

		self.upload_frame = tk.Frame(self.frame, width=300, height=100)
		self.upload_frame.pack()
		self.upload_button = tk.Button(self.upload_frame, text='Select MP3 file...', width=25, command=self.upload_file)
		self.upload_button.pack(side=tk.TOP)
		self.upload_filename_label = tk.Label(self.upload_frame, text=self.filename)
		self.upload_filename_label.pack(side=tk.TOP)

		self.title_frame = tk.Frame(self.frame, width=300, height=100)
		self.title_frame.pack()
		self.title_label = tk.Label(self.title_frame, text="Title: ")
		self.title_label.pack(side=tk.LEFT)
		self.title_entry = tk.Entry(self.title_frame)
		self.title_entry.pack(side=tk.LEFT)

		self.artist_frame = tk.Frame(self.frame, width=300, height=100)
		self.artist_frame.pack()
		self.artist_label = tk.Label(self.artist_frame, text="Artist: ")
		self.artist_label.pack(side=tk.LEFT)
		self.artist_entry = tk.Entry(self.artist_frame)
		self.artist_entry.pack(side=tk.LEFT)

		self.buttons_frame = tk.Frame(self.frame, width=300, height=100)
		self.buttons_frame.pack()
		self.loadButton = tk.Button(self.buttons_frame, text='Load Song', width=25, command=self.load_song)
		self.loadButton.pack(side=tk.LEFT)
		self.cancelButton = tk.Button(self.buttons_frame, text='Cancel', width=25, command=self.close_window)
		self.cancelButton.pack(side=tk.LEFT)

		self.message_frame = tk.Frame(self.frame, width=300, height=100)
		self.message_frame.pack()
		self.message_label = tk.Label(self.message_frame, text=self.message)
		self.message_label.pack(side=tk.TOP)


root = tk.Tk()
app = App(root)
root.mainloop()
