const Location = ({title, position, color="black"}) => {
    return (
        <>
          <circle cx={position.x} cy={position.y} r="5" fill={color} />
          <circle cx="100" cy="60" r="5" fill="black" />
          <circle cx="140" cy="100" r="5" fill="black" />
          <circle cx="100" cy="140" r="5" fill="black" />
        </>
    )
}