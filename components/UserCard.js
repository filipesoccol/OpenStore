import Image from "next/image";
import MaticIcon from "./MaticIcon.js"

export default function Card({ data, k }) {
  return (
    <div key={k} className="mb-5 mr-4">
      <div className="card shadow margin-56">
        <div>
        <Image
          className="card-img-top"
          src={data.image}
          alt="Card image cap"
          width={200}
          height={200}
        />
        </div>
        <div className="card-body">
          <h5 className="card-title" id="namepr{{i.id}}">
            {data.name}
          </h5>
          { data.owner == '0x0000000000000000000000000000000000000000' && <p>On Sale</p>}
          { data.owner != '0x0000000000000000000000000000000000000000' && <p>owner:<br/>{data.owner.substring(0,6)}...{data.owner.substring(data.owner.length-4,data.owner.length)}</p>}
        </div>
      </div>
    </div>
  );
}