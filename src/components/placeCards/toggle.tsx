import { useState } from "react";

export default function useToggle(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, toggle };
}
