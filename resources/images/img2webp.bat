@echo off
echo Converting images to WebP...

for %%f in (*.jpg *.jpeg *.png *.bmp *.tiff) do (
    echo Converting %%f
    cwebp -q 80 "%%f" -o "%%~nf.webp"
)

echo.
echo Conversion complete!
pause
