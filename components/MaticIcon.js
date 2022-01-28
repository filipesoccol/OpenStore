import Image from 'next/image'
import icon from "../public/assets/matic.png"

export default function MaticIcon() {
  return (
    <span className="matic-icon">
        <Image src={icon} alt="MATIC" width={27} height={27}/>
    </span>
  )
}