

bun run build

set APP_NAME=%npm_package_config_app_name%
set APP_TITLE=%npm_package_config_app_title%
set APP_VERSION=%npm_package_version%
set APP_AUTHOR=%npm_package_author_name%

set DEST_DIR=release\%APP_NAME%

mkdir %DEST_DIR% 2>nul

bun build --compile ./server.ts ^
    --outfile %APP_NAME%.exe ^
    --windows-title "%APP_TITLE%" ^
    --windows-publisher "%APP_AUTHOR%" ^
    --windows-version "%APP_VERSION%" ^
    --windows-description "%APP_TITLE%" ^
    --windows-copyright "© %APP_AUTHOR%" ^
    --windows-icon=build/favicon.ico

move %APP_NAME%.exe %DEST_DIR%\

xcopy build %DEST_DIR%\build /E /I /Y

7z a release\%APP_NAME%-%APP_VERSION%.zip %DEST_DIR%\* -r -mx9 -mmt