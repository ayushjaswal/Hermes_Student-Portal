import { useNavigate } from "react-router-dom";

const Card = ({ props }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/courses/${props.paperCode}`)}
      className="w-full cursor-pointer hover:bg-gray-100 borer-1 border rounded-md border-gray-300  shadow-sm p-2 gap-24 "
    >
      <div className="flex justify-between ">
        <div className="text-xl font-bold">{props.paperName}</div>
        <div className="">{props.paperCode}</div>
      </div>
      <div>Credits: {props.credits}</div>
      <div>{props?.descritpion}</div>
    </div>
  );
};

export default Card;
