'use client';

import css from './Notes.module.css';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import NoteModal from '@/components/NoteModal/NoteModal';

import { fetchNotes } from '@/lib/api';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

export default function NotesClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearchValue, currentPage],
    queryFn: () => fetchNotes(currentPage, debouncedSearchValue),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setCurrentPage(1);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={handleOpenModal}>
          Create Note +
        </button>
      </div>
      {isFetching && <Loader />}
      {isError && <ErrorMessage />}
      {data && isSuccess && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}
      {isModalOpen && <NoteModal onClose={handleCloseModal} />}
    </div>
  );
}
