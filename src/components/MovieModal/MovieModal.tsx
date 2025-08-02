// React core
import { useEffect } from "react";
import { createPortal } from "react-dom";

// Types
import type { Movie } from "../../types/movie";

// Styles
import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const { poster_path, title, overview, release_date, vote_average } = movie;

  // обробка закриття модального вікна по клавіші ескейп
  useEffect(() => {
    // функція для передачі слухачу та для очищення
    const handleEscape = (event: KeyboardEvent) => {
      console.log(event.code);
      if (event.code === "Escape") onClose();
    };
    // додаю слухача кнопки ескейп
    document.addEventListener("keydown", handleEscape);
    // повернення функції при розмонтуванні елементу для розміщення в ній очисток
    return () => {
      // очищення слухача кнопки ескейп
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // обробка заборони прокрутки при відкритій модалці
  useEffect(() => {
    // перевіряю чи є вертикальний скролбар
    const hasVerticalScrolbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;
    if (hasVerticalScrolbar) {
      // розрахунок ширини скролбара
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      // встановлюю падінг на ширину скролбара для уникнення зміщення контенту
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    // додаю клас заборони прокрутки на боді
    document.body.classList.add("modal-open");
    // повернення функції при розмонтуванні компоненту
    return () => {
      // прибираю клас заборони прокрутки з боді
      document.body.classList.remove("modal-open");
      // прибираю падінг
      document.body.style.paddingRight = "";
    };
  }, []);

  // обробка закриття модального вікна по кліку на бекдроп
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  console.log("render MovieModal");

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        <img src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt={title} className={css.image} />
        <div className={css.content}>
          <h2>{title}</h2>
          <p>{overview}</p>
          <p>
            <strong>Release Date:</strong> {release_date}
          </p>
          <p>
            <strong>Rating:</strong> {vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;
