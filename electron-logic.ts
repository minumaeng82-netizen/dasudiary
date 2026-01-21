
/* 
  이 파일은 실제 Electron 프로젝트의 electron/main.ts에 해당하며,
  UI에서 IPC를 통해 보낸 요청을 OS 레벨에서 처리합니다.
*/

// import { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } from 'electron';
// import path from 'path';

// let mainWindow: BrowserWindow | null = null;
// let tray: Tray | null = null;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 320,
//     height: 500,
//     frame: false,             // 프레임 제거 (커스텀 위젯 스타일)
//     transparent: true,         // 배경 투명
//     alwaysOnTop: true,         // 항상 위
//     resizable: true,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//     },
//   });

//   // 런타임에 따라 로드 (개발/프로덕션)
//   mainWindow.loadURL('http://localhost:5173');

//   // 트레이 생성
//   const icon = nativeImage.createFromPath('assets/icon.png');
//   tray = new Tray(icon);
//   const contextMenu = Menu.buildFromTemplate([
//     { label: '열기', click: () => mainWindow?.show() },
//     { label: '숨기기', click: () => mainWindow?.hide() },
//     { type: 'separator' },
//     { label: '종료', click: () => app.quit() },
//   ]);
//   tray.setToolTip('School-Link 위젯');
//   tray.setContextMenu(contextMenu);
// }

// // IPC 핸들러
// ipcMain.on('set-always-on-top', (event, flag) => {
//   mainWindow?.setAlwaysOnTop(flag);
// });

// ipcMain.on('set-opacity', (event, opacity) => {
//   mainWindow?.setOpacity(opacity);
// });

// app.whenReady().then(createWindow);
