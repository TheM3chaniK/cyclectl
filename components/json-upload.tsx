'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { JsonUploadModal } from './json-upload-modal'; // New import

interface JsonUploadProps {
  onUploadSuccess: () => void;
}

export function JsonUpload({ onUploadSuccess }: JsonUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Load JSON</Button>
      <JsonUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={onUploadSuccess}
      />
    </>
  );
}
