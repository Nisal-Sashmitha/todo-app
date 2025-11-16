import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('timeboxer', {
  version: '1.0.0'
});
