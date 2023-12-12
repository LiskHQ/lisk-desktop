import React from 'react';
import styles from './PageLoader.css';

function PageLoader({ progress }) {
  return (
    <div className={styles.splashScreen}>
      <figure className={styles.logo}>
        <img
          alt="logo"
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDU2IDU2Ij4KICAgIDxwYXRoIGZpbGw9IiAjYzVjZmU0IiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0yNS41NDUgNDMuOTNjLS4wMjQuMDIzLS4wNy4wNDctLjA5NC4wN2gtMi42MmMtLjA0NyAwLS4wNy0uMDIzLS4wOTQtLjA0N2wtNy43Mi04LjcwNGEuMTUuMTUgMCAwIDEgMC0uMTRsOS42MTUtMTYuNTY0Yy4wNDctLjA3LjE2NC0uMDcuMjEgMGwyLjY5MSA0LjY0NmMuMDIzLjAyMy4wMjMuMDcgMCAuMTE3bC02LjUwMyAxMS4xOWMtLjAyNC4wNDcgMCAuMDk0LjAyMy4xNDFsMy44ODMgNC4zNjRjLjAyNC4wMjMuMDcuMDQ3LjA5NC4wNDdoNC41ODVjLjExNyAwIC4xNjQuMTE3LjA5NC4xODhsLTQuMTY0IDQuNjkyem0yLjg1NC0zMS44NmMuMDQ2LS4wOTMuMTYzLS4wOTMuMTg3IDBMNDEuOTkgMzUuMDYyYy4wMjQuMDQ3IDAgLjA5My0uMDIzLjE0bC03LjcyIDguNzA0YS4xNzcuMTc3IDAgMCAxLS4wOTQuMDQ3aC02LjI2OWMtLjExNyAwLS4xNjQtLjExNy0uMDk0LS4xODhsNC4xODgtNC43MzkgMy45My00LjQxYy4wNDctLjA0Ny4wNDctLjA5NC4wMjMtLjE0bC03LjQzOS0xMi44MS0yLjgwNy00LjgzM2MtLjAyMy0uMDI0LS4wMjMtLjA3IDAtLjExN2wyLjcxNC00LjY0NnoiLz4KPC9zdmc+Cg=="
        />
        <div className={styles.ldsRing}>
          {[...new Array(4).keys()].map((key) => (
            <div key={key} />
          ))}
        </div>
      </figure>
      {progress && (
        <div>
          Loading <span>{progress}%</span>
        </div>
      )}
    </div>
  );
}

export default PageLoader;
