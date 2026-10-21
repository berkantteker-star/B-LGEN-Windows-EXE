# BİLGEM — Windows EXE

This repository packages the existing DAVIVA LAB web application as a separate Windows desktop application. The source repository is **not modified**.

## Build
Open **Actions → BİLGEM Windows EXE → Run workflow**. Download the **BILGEM-Windows-EXE** artifact when the run succeeds. The workflow checks out the latest DAVIVA LAB main branch into a temporary `web/` folder and builds installer + portable EXE using Electron Builder.

## Important
This is a desktop wrapper of the DAVIVA LAB interface, **not an independent offline backend**. Firebase and online services still require connectivity. Google/Firebase authentication may need authorized-origin or desktop-specific OAuth changes; do not assume sign-in works until tested. Do not put private keys, credentials, or patient data into this public repository or the EXE. The generated binaries are not code-signed and may trigger Windows SmartScreen warnings.
