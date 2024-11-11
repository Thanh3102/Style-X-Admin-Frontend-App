import { FaX } from "react-icons/fa6";

type Props = {
    value: string
    onDelete?: () => void;
}

const SelectedTag = ({ value, onDelete }: Props) => {
  return (
    <div className="rounded-full bg-blue-200 px-3 py-1 flex gap-2 items-center w-fit">
      <span className="text-xs whitespace-nowrap block">{value}</span>
      <FaX
        size={18}
        className="text-blue-500 hover:bg-blue-300 hover:cursor-pointer rounded-full p-1"
        onClick={onDelete}
      />
    </div>
  );
};

export { SelectedTag };
