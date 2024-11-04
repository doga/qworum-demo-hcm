class Settings {
  static async read(){
    try {
      const
      response = await fetch('/settings.json'),
      settings = await response.json();

      return settings;
    } catch (error) {
      return {};
    }
  }  
}

export { Settings };
