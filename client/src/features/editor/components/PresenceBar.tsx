type User = {
  id: string
  name: string
  color: string
}

type Props = {
  users: User[]
}

export default function PresenceBar({ users }: Props) {

  return (
    <div className="flex items-center gap-2">

      {users.map(user => (

        <div
          key={user.id}
          className="flex items-center gap-2 px-2 py-1 rounded theme-bg-panel theme-border border shadow-sm text-xs"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: user.color }}
          />

          {user.name}

        </div>

      ))}

    </div>
  )
}