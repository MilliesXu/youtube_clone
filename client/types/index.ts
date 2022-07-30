export enum QueryKeys {
  me = 'me',
  videos = 'videos'
}

export interface Me {
  id: number,
  email: string,
  username: string
}