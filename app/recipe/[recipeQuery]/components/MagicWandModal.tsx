'use client';

import { MagicWandIcon } from '@/app/assets/svgs';
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  Tooltip,
} from '@nextui-org/react';
import ModalSearchbar from './ModalSearchbar';
import { yanone } from '@/app/assets/fonts/fonts';

export default function MagicWandModal({
  recipe,
  className,
}: {
  recipe: Recipe;
  className?: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onClick = () => {
    onOpen();
  };
  return (
    <>
      <div
        className={`w-full flex flex-col items-center max-w-min ${className}`}
      >
        <Tooltip
          showArrow
          content={`${recipe.name} but ...`}
          classNames={{
            base: ['before:bg-primary'],
            content: ['py-2 px-4 shadow-xl text-white bg-primary'],
          }}
        >
          <Button onPress={onClick} className='bg-white'>
            <MagicWandIcon />
          </Button>
        </Tooltip>
        <p
          className={`text-lg md:text-xl lg:text-2xl opacity-60 font-bolder ${yanone.className}`}
        >
          Modify
        </p>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={'center'}
        size='xl'
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                <p
                  className={`uppercase text-2xl font-bold text-center pt-5 ${yanone.className}`}
                >
                  Make changes to {recipe.name}
                </p>
                <p className='border-t-1 border-dashed border-gray-500 py-3 opacity-80 italic font-bold'>
                  Type any adjustments you&apos;d like to this recipe, and
                  we&apos;ll try to tailor it to your preferences and desires.
                </p>
                <ModalSearchbar recipe={recipe} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
