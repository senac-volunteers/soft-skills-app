interface Props {
  className?: string,
  title: string,
  link: string
}

const Anchor = (props: Props) => {
  return (
    <a href={props.link}
      className={`bg-blue-500 hover:bg-blue-600 text-purple-50 font-semibold py-2.5 px-7 rounded-xl ${props.className}`}>
      <span>{props.title}</span>
    </a>
  )
}

export default Anchor