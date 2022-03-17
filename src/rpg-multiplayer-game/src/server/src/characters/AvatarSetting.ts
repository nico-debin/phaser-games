export interface AvatarSetting {
  name: string
  body: {
    sizeFactor: number
    size: {
      width: number
      height: number
      center?: boolean | undefined
    }
    offset: {
      x: number
      y: number
    }
  }
}

// const factorize = (avatarSetting: AvatarSetting, n: number) => avatarSetting.body.sizeFactor * n

export const avatarSettings: AvatarSetting[] = [
  {
    name: 'generic-lpc',
    body: {
      sizeFactor: 1,
      size: {
        width: 64 * 0.25,
        height: 64 * 0.50,
        center: true,
      },
      offset: {
        x: 24,
        y: 29,
      }
    }
  },
]

export const noOpAvatar: AvatarSetting = {
  name: '',
  body: {
    sizeFactor: 0,
    size: {
      width: 0,
      height: 0,
      center: false,
    },
    offset: {
      x: 0,
      y: 0,
    }
  }
}
