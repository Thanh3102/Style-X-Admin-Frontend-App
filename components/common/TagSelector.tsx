"use client";
import { TagType } from "@/libs/types/backend";
import { useEffect, useState } from "react";
import { cn } from "@/libs/utils";
import { TagSearch } from "./TagSearch";
import { SelectedTag } from "../ui/SelectedTag";
import { GroupBox } from "../ui/GroupBox";
import { Modal, ModalContent } from "@nextui-org/react";

export type TagSelectorProps = {
  type: TagType;
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
};

const TagSeletor = ({
  type,
  defaultValue = [],
  onValueChange,
}: TagSelectorProps) => {
  const [selectedTags, setSelectedTabs] = useState<string[]>(defaultValue);
  const [openModal, setOpenModal] = useState(false);

  const handleCheckboxClick = (isSelected: boolean, name: string) => {
    const isExist = selectedTags.find((selectedTag) => selectedTag === name);

    if (isSelected) {
      if (isExist) return;
      setSelectedTabs((selectedTags) => [...selectedTags, name]);
      return;
    }

    if (isExist) {
      setSelectedTabs((selectedTags) =>
        selectedTags.filter((tag) => tag !== name)
      );
    }
    return;
  };

  const handleDeleteTag = (name: string) => {
    if (!name) return;
    setSelectedTabs((selectedTags) =>
      selectedTags.filter((tag) => tag !== name)
    );
  };

  const handleAddTag = (name: string) => {
    setSelectedTabs((selectedTags) => [...selectedTags, name]);
  };

  useEffect(() => {
    if (onValueChange) onValueChange(selectedTags);
  }, [selectedTags]);

  return (
    <>
      <GroupBox
        title="Tags"
        // titleEndContent={
        //   <span
        //     className="label-link text-sm font-medium"
        //     onClick={() => setOpenModal(true)}
        //   >
        //     Danh sách tag
        //   </span>
        // }
      >
        <div className="col-12">
          <div className="relative">
            <TagSearch
              selectedTags={selectedTags}
              type={type}
              onAddTag={handleAddTag}
              onCheckBoxChange={(isSelected, tag) =>
                handleCheckboxClick(isSelected, tag)
              }
            />

            <div
              className={cn("py-4 hidden gap-2 flex-wrap max-w-full", {
                flex: selectedTags.length > 0,
              })}
            >
              {selectedTags.map((tag) => (
                <SelectedTag
                  key={tag}
                  value={tag}
                  onDelete={() => handleDeleteTag(tag)}
                />
              ))}
            </div>
          </div>
        </div>
      </GroupBox>

      <Modal isOpen={openModal} onOpenChange={(open) => setOpenModal(open)}>
        <ModalContent>Danh sách tag</ModalContent>
      </Modal>
    </>
  );
};

export { TagSeletor };
