// React core
import { memo } from "react";

// Libraries
import toast from "react-hot-toast";

// Styles
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

const SearchBar = ({ onSubmit }: SearchBarProps) => {
  // функція обробки пошуку при сабміті форми
  const handleSubmit = (formData: FormData) => {
    // читаю значення поля форми
    const query = formData.get("query") as string;
    // перевірка значення
    if (!query.trim()) {
      // якщо значення пусте вивожу повідомлення
      const message = "Please enter your search query.";
      toast.error(message);
    } else {
      // якщо значення не пусте виконую отриману пропсом функцію
      onSubmit(query);
    }
  };

  console.log("render SearchBar");

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a className={styles.link} href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
          Powered by TMDB
        </a>
        <form className={styles.form} action={handleSubmit}>
          <input className={styles.input} type="text" name="query" autoComplete="off" placeholder="Search movies..." autoFocus />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default memo(SearchBar);
