# Library 
## Installation
Ladda hem projektet och installera med 
```
git clone https://github.com/Soderbom/dsd_lib.git
cd dsd_lib
npm install
cd api
npm install
```
Skapa två nya filer i /api ".env" och "db.js":

Lägg till raden nedan i .env:
```
jwtSecret="<SKRIV ETT LÖSENORD HÄR>"
```

Lägg till nedanstående i "db.js":
```
const mysql = require("mysql");

const config = {
    host: '<IP TILL DIN DATABAS',
    user: 'dev',
    password: 'password',
    database: 'books4days'
  };

const conn = mysql.createConnection(config);

module.exports = conn;
```

Slutligen ändra IP-adressen i /src/misc.js till IP-adressen där din API körs



# Databas
## Skapa användare
```
CREATE DATABASE books4days;

CREATE USER ‘dev’@’%’ IDENTIFIED BY ‘password’;
ALTER USER 'dev'@'%' IDENTIFIED WITH mysql_native_password BY 'password';

GRANT ALL PRIVILEGES ON books4days.* TO dev@’%’;
```

## Skapa tables
```
CREATE TABLE Users (
email VARCHAR(255) NOT NULL PRIMARY KEY,
username VARCHAR(30) NOT NULL,
pwhash VARCHAR(255) NOT NULL
);

CREATE TABLE Library (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
author VARCHAR(255) NOT NULL,
published INT(4),
stock INT NOT NULL,
coverurl VARCHAR(255)
);

CREATE TABLE Loaned (
id INT UNSIGNED AUTO_INCREMENT,
email VARCHAR(255),
book_id INT UNSIGNED,
PRIMARY KEY (id),
FOREIGN KEY (email) REFERENCES Users(email), 
FOREIGN KEY (book_id) REFERENCES Library(id)
);
```

## Stored procedures
### Utlåning (loan_book)
```
CREATE DEFINER=`dev`@`%` PROCEDURE `loan_book`(IN email VARCHAR(255), IN book_id INT unsigned)
BEGIN
    -- Kontrollera antal tillgängliga böcker för titeln
    SET @stock := (SELECT stock FROM books4days.Library WHERE id = book_id LOCK IN SHARE MODE);
	
    -- Commit endast om det finns böcker att låna ut
    IF @stock > 0 THEN
		-- Minska antalet tillgängliga böcker
		UPDATE books4days.Library SET stock = stock - 1 WHERE id = book_id;
        -- Lägg till en ny rad i utlånade böcker
        INSERT INTO books4days.Loaned (email, book_id) VALUES (email, book_id);
		COMMIT;
	END IF;	
    CALL get_loans(email);
END
```

### Återlämning (return_book)
```
CREATE DEFINER=`dev`@`%` PROCEDURE `return_book`(IN email_arg VARCHAR(255), IN book_id_arg INT unsigned)
BEGIN
	-- Kontrollera om det finns en bokning
	SET @e := (SELECT id FROM books4days.Loaned WHERE email = email_arg AND book_id = book_id_arg LIMIT 1);

	IF @e IS NOT NULL THEN
		DELETE FROM books4days.Loaned WHERE email = email_arg AND book_id = book_id_arg;
		UPDATE books4days.Library SET stock = stock + 1 WHERE id = book_id_arg;
		COMMIT;
	END IF;
    CALL get_loans(email_arg);
END
```

### Hämta lån för respektive användare (get_loans)
```
CREATE DEFINER=`dev`@`%` PROCEDURE `get_loans`(IN email VARCHAR(255))
SELECT books4days.Library.id, Library.title, books4days.Library.author, books4days.Library.published, books4days.Library.coverurl FROM books4days.Loaned INNER JOIN books4days.Library ON books4days.Loaned.book_id = books4days.Library.id WHERE books4days.Loaned.email = email
```

### Skapa användare (add_user)
```
CREATE DEFINER=`dev`@`%` PROCEDURE `add_user`(IN par_email VARCHAR(255), IN par_username VARCHAR(30), IN par_pwhash VARCHAR(255))
BEGIN
    -- Kontroll att användaren exisisterar
    SET @userCheck := (SELECT email FROM books4days.Users WHERE email = par_email);

    -- Commit endast om användaren inte existerar
    IF @userCheck IS NULL THEN
		-- Lägg till en ny rad i användare
		INSERT INTO books4days.Users (email, username, pwhash) VALUES (par_email, par_username, par_pwhash);
        COMMIT;
        SELECT email FROM books4days.Users WHERE email = par_email;
    END IF;
END
```
