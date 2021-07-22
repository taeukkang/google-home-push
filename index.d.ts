export = GoogleHome;

declare class GoogleHome {
  constructor(deviceIdentifier: string, options?: GoogleHomeConstructorOptions);

  device: GoogleHomeDeviceProperties;
  options: GoogleHomeOptions;

  searchDevice(name?: string): Promise<string>;
  speak(message: string, language?: string): Promise<any>;
  push(url: string): Promise<any>;
}

interface GoogleHomeConstructorOptions {
  language?: string;
  speed?: number;
  timeout?: number;
}

interface GoogleHomeOptions {
  language?: string;
  speed?: number;
  timeout?: number;
}

interface GoogleHomeDeviceProperties {
  ip?: string;
  name?: string;
  identifier?: string;
}
