# Draw integration
Plugin to integrate your favourite draw application into your obsidian workflow.

Create, open, export (only to .png for the moment), 
all this using a single and already used expression in obsidian.
```markdown
![[path/to/image.png]]
```
That's all, no weird business with new syntax.

# Disclaimer
If you are in Linux.
This might only run if you are running Obsidian as a regular application, 
Because I don't think, flatpak might allow to run a shell command on the host machine (haven't tried it).

# Usage

This plugin is based on shell commands, 
so maybe you are gonna need to know a little about it.
But in case you are new I'll leave some examples for Krita and MyPaint at the end, 
so you can start right away (almost).

## \!\[\[create/image/link/to/path/to/image.png]]
First you need to create an empty image link,
by empty I mean that the image doesn't exists.

The location should be relative to your vault, so if you type `![[draws/image.png]]`,
the image will be stored inside your vault in the folder draw. 
You don't need to create the folder, it should be created automatically.

Once created you can then run the commands from the command palette.

## Open Draw 
Now that you created your empty image link, 
now while your cursor is on that line, you can run the `Open Draw` command,
1. Open the command palette.
2. Type `draw` (due to how obsidian manages the commands when searching this is a simple way to find the commands).
3. Click/Run the command `Open Draw`.
This command will:
1. Create the project file.
2. Open the program.
This way you can start drawing on your favorite program as you would do on a regular session.
Then you save, and quit the program, and now you draw project is totally saved.

## Export Draw 
When you already finished your draw session, you might want to export your drawing.
You can do this by running the other command `Export Draw`, 
while your cursor is on the image link.
1. Type `drawx` (again obsidian command search is weird, but useful).
2. Click/Run the command `Export Draw`.
This will export the project to a png.
And will e automatically update the draw.

### Issues
After updating your drawing, and exporting for a second time, 
you might notice that it doesn't update,
this is because obsidian doesn't include a way to force the file cache to update,
so you have to force it by hand, this can be done by:
- Closing and re-opening the file.
- Cut and paste again the image link.

# Settings

## Explanation
This settings use a `{template}` to fill in the gaps of the commands.
- `{this.file}` is the location of the project file, this is the argument you'll pass to your program.
- `{this.dest}` is the location of the image on your image link, the output argument for the export command.

## Destiny
This is the location of where your projects are gonna be stored,
because you might not want to store them in a regular path.

The location is totally relative to your vault.
So if you just leave it as `.krita`,
every project file is gonna be stored inside your vault but inside this `.krita` directory.
This folder will mimic the structure you have defined in the image link.
So for example, for `![[draw/image.png]]` the project will be stored in `.krira/draw/image.kra`.

## File extension
To allow other draw applications like MyPaint,
I added this setting to specify how the files should be called for your projects.
So for example, if you are using MyPaint you can use the `.ora` file extension.

## Creation command
This is the shell command you'll typically run to create a file for your program.
For Krita and MyPaint there are no commands for that, so you'll need to copy a file.

It needs the `{this.file}` argument, because is the location in where the project file is gonna be created.

## Open command
The command to open your program, 

Needs `{this.file}` argument to know where the file is located at.

## Export command
Command to export your project into the png.

Needs the two `{this.file}` to know where the project is located at.
And `{this.dest}` to know where to export the file.

# Examples
As I promised there are some examples and a little guide on how you can get started.

## Krita
If you wish to use Krita, you first might need to create a template file, 
because Krita doesn't include a creation command.
And move this file to a directory on your PC under the name `draw.kra`.

### Pre requisites
Install Krita.

### Destiny
```config
.krita
```
The project files will be stored inside the folder `.krita`, better to have them apart.

### File extension
```config
.kra
```
Its the file extension for the Krita projects.

### Creation command
```config
cp /path/to/draw.kra ${this.file}
```
For this one you might need to replace the `/path/to/` with your actual location for the file.

### Open command
```config
krita ${this.file}
```
Of course in case you can totally run Krita from your terminal as that.

Other option to run Krita could be if you are using flatpak.
```config
flatpak run org.kde.krita ${this.file}
```

### Build command
```config
krita ${this.file} --export --export-filename ${this.dest}
```

Flatpak. (I haven't tried this method)
```config
flatpak run org.kde.krita ${this.file} --export --export-filename ${this.dest}
```

## MyPaint
If you want an infinite canvas, you can use MyPaint.
Same reason as krita you need to create a template file, 
And move it to your a directory under the name `draw.ora`.

### Pre requisites
Install:
- MyPaint.
- ImageMagick (its for image manipulation).


### Destiny
```config
.ora
```
The project files will be stored inside the folder `.ora`.

### File extension
```config
.ora
```
Stands for Open Raster, and as far as I know and its pretty used in the open source community.

### Creation command
```config
cp /path/to/draw.ora ${this.file}
```
For this one you might need to replace the `/path/to/` with your actual location for the file.

### Open command
```config
mypaint ${this.file}
```
If you can run mypaint from your terminal, 
I envy you because MyPaint in my ArchLinux is a PITA (I use Arch, btw), 
and don't want to troubleshoot it, so I use the Flatpak version.
```config
flatpak run org.mypaint.MyPaint ${this.file}
```

### Build command
```config
magick ${this.file} ${this.dest}
```
As the command indicates its magic, because it can turn every image type into every image type (I haven't tested this statement tbh).


