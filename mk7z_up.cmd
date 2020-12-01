echo off

for /F %%i in ("%cd%") do set proj=%%~ni
rem timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "fecha=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"

REM echo "Proj (%proj%)"
REM echo "fecha (%fecha%)"

set PATH="c:\Program Files\7-Zip";%PATH%
set tf=%proj%_%fecha%.7z

set here=%cd%
rm -rfv %here%\.vscode\ipch
cd ..
7z a -bsp2 -mx9 -stl -xr!node_modules %tf% %proj%
cd %here%

pause