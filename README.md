This work is licensed under a 
<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License
</a>.
<br />
<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
  <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" />
</a>

# Chorus Encore Chart File Formats
This document lists the file formats **Chorus Encore (CE)** supports, and to what formats and image sizes it will convert the files for the *future bundles*, which are the standardized packages CE provides to the players. Those packages will have audio files, videos and images converted to the recommended formats and sizes. The original chart folders will still be offered as well.

## Supported formats and what they can be converted into
The chart file itself has to be named `notes`, and the format of it needs to be `.chart` or `.mid`.

The list of supported audio file names is as follows:
`song`, `guitar`,  `bass`,  `rhythm`,  `vocals`,  `vocals_1`,  `vocals_2`,  `drums`,  `drums_1`,  `drums_2`,  `drums_3`,  `drums_4`,  `keys`, `crowd`.

Supported audio formats in CE are `.ogg`, `.mp3`, `.wav` and `.opus`. The recommended format is `.opus`, and if the audio isn't `.opus` yet, it will be converted to that for the *future bundles*.

Album art needs to be named `album`, background images `background` and highway images `highway`. The supported formats for these are `.png`, `.jpg` and `.jpeg`. Album art will be converted to 512x512 sized `.png` if it isn't already that. Backgrounds and highways won't be touched.

Background videos should be named `video`, and animated highways `highway`. The supported formats for those are `.mp4`, `.avi`, `.webm`, `.vp8`, `.ogv` and `.mpeg`. These videos will be muted and converted to `.webm` if they aren't that format already. The converted videos will be 30 fps to save on resources, so if you'd like to have a higher fps video in the CE's *future bundle*, you'll need to convert it to `.webm` yourself.

The text file that contains the metadata of the chart needs to be named `song.ini`. The *future bundle* will have a newly generated `song.ini` that uses the tags below in this order:
```
name
artist
album
genre
year
charter
icon
diff_band
diff_bass
diff_bassghl
diff_drums_real
diff_drums
diff_guitar_coop
diff_guitar
diff_guitarghl
diff_keys
diff_rhythm
album_track
playlist_track
song_length
preview_start_time
video_start_time
pro_drums
five_lane_drums
modchart
loading_phrase
```
If you have the tags `frets` or `track`, the information after those tags will be moved to the tags `charter` and `album_track`, respectively.

However, if you have any of the tags below in your `song.ini`, CE won't generate the package at all. These tags can alter the gameplay of the chart, so CE just removing them could break the chart. Because of that, the charter should remove these tags and in progress make sure the chart still works like it should. After these tags are removed, CE will make a *future bundle* of the chart.
```
delay
hopo_frequency
multiplier_note
sustain_cutoff_threshold
end_events
```
