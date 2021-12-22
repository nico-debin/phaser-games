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
    name: 'fauna',
    body: {
      sizeFactor: 32,
      size: {
        width: 0.41,
        height: 0.4,
        center: false,
      },
      offset: {
        x: 0.31,
        y: 0.45,
      },
    },
  },
  {
    name: 'lizard',
    body: {
      sizeFactor: 1,
      size: {
        width: 16 * 0.8,
        height: 28 * 0.5,
        center: true,
      },
      offset: {
        x: 2,
        y: 12,
      },
    },
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
