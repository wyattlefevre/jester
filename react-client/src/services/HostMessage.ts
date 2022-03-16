export default interface HostMessage {
  text: string
  size: HostMessageSizes
}

export enum HostMessageSizes {
  small = 0,
  medium = 1,
  large = 2,
}
