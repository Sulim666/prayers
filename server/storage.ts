import { userPreferences, prayerTimesCache, users, type User, type InsertUser, type UserPreferences, type InsertUserPreferences, type PrayerTimesCache, type InsertPrayerTimesCache } from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User preferences methods
  getUserPreferences(ipAddress: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(ipAddress: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined>;
  
  // Prayer times cache methods
  getPrayerTimesCache(location: string, date: string, method: number): Promise<PrayerTimesCache | undefined>;
  createPrayerTimesCache(cache: InsertPrayerTimesCache): Promise<PrayerTimesCache>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userPreferencesMap: Map<string, UserPreferences>;
  private prayerTimesCacheMap: Map<string, PrayerTimesCache>;
  private userId: number;
  private preferencesId: number;
  private cacheId: number;

  constructor() {
    this.users = new Map();
    this.userPreferencesMap = new Map();
    this.prayerTimesCacheMap = new Map();
    this.userId = 1;
    this.preferencesId = 1;
    this.cacheId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // User preferences methods
  async getUserPreferences(ipAddress: string): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferencesMap.values()).find(
      (prefs) => prefs.ipAddress === ipAddress
    );
  }
  
  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = this.preferencesId++;
    const now = new Date();
    const userPrefs: UserPreferences = { 
      ...preferences, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.userPreferencesMap.set(id.toString(), userPrefs);
    return userPrefs;
  }
  
  async updateUserPreferences(ipAddress: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const existingPrefs = await this.getUserPreferences(ipAddress);
    
    if (!existingPrefs) {
      return undefined;
    }
    
    const updatedPrefs: UserPreferences = {
      ...existingPrefs,
      ...preferences,
      updatedAt: new Date()
    };
    
    this.userPreferencesMap.set(existingPrefs.id.toString(), updatedPrefs);
    return updatedPrefs;
  }
  
  // Prayer times cache methods
  async getPrayerTimesCache(location: string, date: string, method: number): Promise<PrayerTimesCache | undefined> {
    const cacheKey = `${location}-${date}-${method}`;
    const cacheEntry = Array.from(this.prayerTimesCacheMap.values()).find(
      (cache) => 
        cache.location === location && 
        cache.date === date && 
        cache.method === method &&
        cache.expiresAt > new Date()
    );
    
    return cacheEntry;
  }
  
  async createPrayerTimesCache(cache: InsertPrayerTimesCache): Promise<PrayerTimesCache> {
    const id = this.cacheId++;
    const now = new Date();
    const cacheEntry: PrayerTimesCache = {
      ...cache,
      id,
      createdAt: now
    };
    
    this.prayerTimesCacheMap.set(id.toString(), cacheEntry);
    return cacheEntry;
  }
}

export const storage = new MemStorage();
