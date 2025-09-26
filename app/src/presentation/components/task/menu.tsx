import { RiMore2Fill } from "react-icons/ri";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { Icon } from "../icon";
import { Button } from "../button";

type TaskMenuProps = {
  onUpdate: () => void;
  onDelete: () => void;
};

export const TaskMenu = ({ onUpdate, onDelete }: TaskMenuProps) => {
  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onUpdate();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton
        as={Button}
        className="btn-outline btn-circle text-base-content btn-xs btn-neutral"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          e.stopPropagation()
        }
      >
        <Icon Icon={RiMore2Fill} />
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className="menu [--anchor-gap:8px] bg-base-100 rounded-box min-w-80 lg:min-w-64 z-10 border-base-content/10 border shadow-lg focus:outline-none focus-visible:outline-none focus-within:outline-none"
      >
        <MenuItem as="li">
          <button onClick={handleUpdate}>Update</button>
        </MenuItem>
        <MenuItem as="li">
          <button onClick={handleDelete}>Delete</button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
