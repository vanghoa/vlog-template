for %i in (*.mp4) do ffmpeg -i "%i" "%~ni.mp3"

-vf "frei0r=filter_name=pixeliz0r:filter_params=0.02|0.02"

for %i in (*.webm) do ffmpeg -i "%i" -vf "frei0r=filter_name=pixeliz0r:filter_params=0.02|0.02" export/"%~ni.webm"

Get-ChildItem -Filter *.webm | ForEach-Object {
  ffmpeg -i $_.FullName -vf "frei0r=filter_name=pixeliz0r:filter_params=0.02|0.02" ".\export\$($_.Name)"
}

for %i in (*.mov) do ffmpeg -i "%i" -c:v libvpx-vp9 -crf 32 -an -b:v 8k -vf "scale=1000:-1, fps=25" "%~ni.webm"