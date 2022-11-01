imagemin * --plugin.mozjpeg.progressive=true --plugin.mozjpeg.max=95 --plugin.mozjpeg.stripAll=true --plugin.mozjpeg.size=200 *.jpg --out-dir=./out

imagemin * --plugin.pngquant.speed=1 --plugin.pngquant.quality=0.9 --plugin.pngquant.quality=0.9 *.png --out-dir=./out

foreach ($file in Get-ChildItem) { cwebp -q 100 $file -o otoke.webp }

magick mogrify -resize 1700x> -quality 100 -path out *.jpg

magick mogrify -format jpg *.jpeg   

imagemin * --plugin.mozjpeg.progressive=true --plugin.mozjpeg.max=50 --plugin.mozjpeg.stripAll=true --plugin.mozjpeg.size=50 *.jpg --out-dir=./out

cleancss -o style_min.css style.css

.{
terser scripts/script_start.js --compress --mangle --output scripts_min/script_start.js

terser scripts/script_end.js --compress --mangle --output scripts_min/script_end.js
}

for %i in (*.MOV) do ffmpeg -i "%i" "%~ni.webm"
//////////////////////////////
. {
    magick *.heic -quality 100% *.jpg
}

.{
    Get-ChildItem | ForEach-Object {
        magick $_ -quality 100% "$($_.Basename).jpg"
    }
}