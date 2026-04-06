Basic usage:
------------
py -3 add_footer.py [target] [stdout]

*******************************************************
** Option 1
** WARNING:
** If no target is specified this processes all docs!!
*******************************************************
py -3 add_footer.py

This processes: %GIA%\docs\**\*.html

*******************************************************
** Option 2 - Entire docs folder (explicit)
*******************************************************
py -3 add_footer.py docs

*******************************************************
** Option 3 - Subfolder
*******************************************************
py -3 add_footer.py docs\web

*******************************************************
** Single file
*******************************************************
py -3 add_footer.py docs\web\index.html

*******************************************************
** Absolute path (also works)
*******************************************************
py -3 add_footer.py C:\full\path\to\file.html

*******************************************************
stdout (safe mode)
*******************************************************
Add stdout anywhere in the command to preview ONE file:

py -3 add_footer.py docs\web\index.html stdout

Redirect to file:
py -3 add_footer.py docs\web\index.html stdout > preview.html

*******************************************************
Preview a folder
*******************************************************
py -3 add_footer.py docs\web stdout

Redirect an entire folder:

py -3 add_footer.py docs\web stdout > preview.txt

*******************************************************
Preview EVERYTHING
*******************************************************
py -3 add_footer.py stdout

Real writes (no stdout)
-----------------------
Apply to ONE file:
py -3 add_footer.py docs\web\index.html

Apply to folder:
py -3 add_footer.py docs\web

Apply to EVERYTHING
py -3 add_footer.py
