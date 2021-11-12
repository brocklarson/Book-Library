let myLibrary = [];

class Book {
    constructor(title = "Unknown",
        author = "Unknown",
        coverType = "Unknown",
        checkedOut = false,
        notes = "none",
        bookID = null
    ) {
        this.title = title
        this.author = author
        this.coverType = coverType
        this.checkedOut = checkedOut
        this.notes = notes
        this.bookID = bookID
    }

    checkOut() {
        if (this.checkedOut) this.checkedOut = false;
        else this.checkedOut = true;
    };

    removeBook() {
        const confirmMessage = `Remove '${this.title}' by '${this.author}' from the library?`;
        const confirm = window.confirm(confirmMessage);
        if (!confirm) return;
        myLibrary.splice(myLibrary.indexOf(this), 1);
    }

    showBookInfo() {
        const formBackground = document.getElementById(`formBackground`);
        const bookInfoContainer = document.getElementById(`bookInfoContainer`);
        const closeInfo = document.getElementById(`closeInfo`);

        document.getElementById(`bookInfoID`).innerText = this.bookID;
        document.getElementById(`bookInfoTitle`).innerText = this.title;
        document.getElementById(`bookInfoAuthor`).innerText = this.author;
        document.getElementById(`bookInfoCover`).innerText = this.coverType;
        document.getElementById(`bookInfoStatus`).innerText = this.checkedOut ? `Checked Out` : `Available`;
        document.getElementById(`bookInfoNotes`).innerText = this.notes;

        bookInfoContainer.classList.add(`show`);
        formBackground.classList.add(`show`);

        closeInfo.addEventListener(`click`, this.hideBookInfo);
        formBackground.addEventListener(`click`, this.hideBookInfo);
    }

    hideBookInfo() {
        const formBackground = document.getElementById(`formBackground`);
        const bookInfoContainer = document.getElementById(`bookInfoContainer`);
        const closeInfo = document.getElementById(`closeInfo`);

        bookInfoContainer.classList.remove(`show`);
        formBackground.classList.remove(`show`);

        closeInfo.removeEventListener(`click`, this.hideBookInfo);
        formBackground.removeEventListener(`click`, this.hideBookInfo);
    }
}

const storage = (() => {
    function updateLocalStorage() {
        if (_storageAvailable('localStorage')) {
            localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
        }
    }

    function getLocalStorage() {
        if (_storageAvailable('localStorage')) {
            if (localStorage.getItem('myLibrary')) {
                return JSON.parse(localStorage.getItem('myLibrary'));
            }
        }
    }

    function _storageAvailable(type) {
        let storage;
        try {
            storage = window[type];
            let x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return e instanceof DOMException && (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }

    return { updateLocalStorage, getLocalStorage }
})();

const libraryLog = (() => {
    //CACHE DOM
    const _bookCount = document.getElementById(`bookCount`);
    const _checkedOutCount = document.getElementById(`checkedOutCount`);

    function updateLog() {
        _bookCount.innerText = myLibrary.length;
        _checkedOutCount.innerText = myLibrary.filter(book => book.checkedOut === true).length;
    }

    return { updateLog }
})();

const addBookModule = (() => {
    //CACHE DOM
    const formBackground = document.getElementById(`formBackground`);
    const formContainer = document.getElementById(`formContainer`);
    const submitButton = document.getElementById(`submitButton`);
    const addBookButton = document.getElementById(`addBookButton`);
    const exitForm = document.getElementById(`closeForm`);

    //LISTENERS
    addBookButton.addEventListener(`click`, showForm);
    exitForm.addEventListener(`click`, closeForm);
    formBackground.addEventListener(`click`, closeForm);
    submitButton.addEventListener(`click`, submitBook);

    //HANDLE FORM
    function showForm() {
        document.getElementById(`bookTitle`).value = ``;
        document.getElementById(`bookAuthor`).value = ``;
        document.getElementById(`coverType`).value = `Paperback`;
        document.getElementById(`optionalNotes`).value = ``;
        document.getElementById(`checkedOutSwitch`).checked = false;
        formContainer.classList.add(`show`);
        formBackground.classList.add(`show`);
    }

    function closeForm() {
        formContainer.classList.remove(`show`);
        formBackground.classList.remove(`show`);
    }

    function submitBook(event) {
        event.preventDefault();
        if (invalidForm()) return;
        addBookToLibrary();
        closeForm();
        tableModule.updateDisplay();
    }

    function invalidForm() {
        let invalid = false;
        const invalidIndicator = document.querySelectorAll(`small`);

        for (let i = 0; i < invalidIndicator.length; i++) {
            invalidIndicator[i].classList.remove(`show`);
        }

        if (addBookForm.elements[`bookTitle`].value === ``) {
            document.getElementById('invalidTitle').classList.add(`show`);
            invalid = true;
        }
        if (addBookForm.elements[`bookAuthor`].value === ``) {
            document.getElementById('invalidAuthor').classList.add(`show`);
            invalid = true;
        }
        return invalid;
    }

    function addBookToLibrary() {
        const newBook = createBook();
        if (isDuplicate(newBook)) return;
        myLibrary.unshift(newBook);
    }


    function isDuplicate(newBook) {
        const duplicateBook = inLibrary(newBook);
        if (duplicateBook) {
            const confirmMessage = `${duplicateBook.title} by ${duplicateBook.author} is already in your Library with a ID of '${duplicateBook.bookID}'.\n\nDo you still want to add this book?`;
            const confirm = window.confirm(confirmMessage);
            if (!confirm) return true;
        }
        return false;
    }

    function inLibrary(newBook) {
        return myLibrary.find((book) => {
            if (book.title.toLowerCase() === newBook.title.toLowerCase() &&
                book.author.toLowerCase() === newBook.author.toLowerCase()) return true;
        });
    }

    function createBook() {
        const title = addBookForm.elements[`bookTitle`].value;
        const author = addBookForm.elements[`bookAuthor`].value;
        const coverType = addBookForm.elements[`coverType`].value;
        const checkedOut = addBookForm.elements[`checkedOutSwitch`].checked;
        const notes = addBookForm.elements[`optionalNotes`].value;
        const bookID = myLibrary.indexOf(myLibrary.at(-1)) + 1;
        return new Book(title, author, coverType, checkedOut, notes, bookID);
    }
})();

const tableModule = (() => {
    //CACHE DOM
    const bookTable = document.getElementById(`tableBody`);
    const table = document.querySelector(`table`);
    const searchBar = document.getElementById(`searchBar`);

    //LISTENERS
    table.addEventListener(`click`, handleTableClick);
    searchBar.addEventListener('input', updateTable);

    (function initialize() {
        setupLibrary();
        sortLibrary(`ascending`, `bookID`);
        updateDisplay();
    })();

    function setupLibrary() {
        if (storage.getLocalStorage() && storage.getLocalStorage().length > 0) {
            bookList = storage.getLocalStorage(); //from booklist.js
        }
        bookList.forEach((book) => { //from booklist.js
            myLibrary.push(new Book(book.title, book.author, book.coverType, book.checkOut, book.notes, book.bookID));
        });
    }

    //UPDATE DISPLAY
    function updateDisplay() {
        if (!myLibrary) return;
        updateTable();
        libraryLog.updateLog();
        storage.updateLocalStorage();
    }

    function updateTable() {
        resetTable();
        const displayLibrary = filterBooks(); //if using search bar
        if (!displayLibrary.length) return;
        for (let i = 0; i < displayLibrary.length; i++) {
            createRow(displayLibrary[i]);
        }
    }

    function resetTable() {
        let i = 0
        while (bookTable.firstChild || i > 10000) {
            i++;
            bookTable.removeChild(bookTable.firstChild);
        }
    }

    function filterBooks() {
        const search = searchBar.value.toLowerCase();
        return myLibrary.filter(book => (book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search)));
    }

    function createRow(currentBook) {

        const bookRow = document.createElement(`tr`);
        const bookTitle = document.createElement(`td`);
        const bookAuthor = document.createElement(`td`);
        const coverType = document.createElement(`td`);
        const checkedOut = document.createElement(`td`);
        const viewIconCell = document.createElement(`td`);
        const viewIcon = document.createElement(`span`);
        const removeIconCell = document.createElement(`td`);
        const removeIcon = document.createElement(`span`);

        //Matches the book row with the object
        bookRow.dataset.indexNumber = currentBook.bookID;

        bookTitle.innerText = currentBook.title;
        bookAuthor.innerText = currentBook.author;
        coverType.innerText = currentBook.coverType;
        checkedOut.innerText = currentBook.checkedOut ? `Checked Out` : `Available`;
        viewIcon.innerText = `visibility`;
        removeIcon.innerText = `close`;

        viewIconCell.classList.add(`icons-cell`);
        removeIconCell.classList.add(`icons-cell`);
        viewIcon.classList.add(`material-icons-outlined`, `view`);
        removeIcon.classList.add(`material-icons-outlined`, `remove`);
        checkedOut.classList.add(`checked-out-cell`);

        bookTable.appendChild(bookRow);
        bookRow.appendChild(bookTitle);
        bookRow.appendChild(bookAuthor);
        bookRow.appendChild(coverType);
        bookRow.appendChild(checkedOut);
        bookRow.appendChild(viewIconCell);
        bookRow.appendChild(removeIconCell);

        viewIconCell.appendChild(viewIcon);
        removeIconCell.appendChild(removeIcon);
    }

    //TABLE FUNCTIONALITY
    function handleTableClick(event) {
        if (event.target.classList.contains(`remove`)) removeBook(event);
        else if (event.target.classList.contains(`view`)) viewBookInfo(event);
        else if (event.target.classList.contains(`checked-out-cell`)) changeBookStatus(event);
        else if (event.target.classList.contains(`table-header-text`)) handleSorting(event);
    }

    function removeBook(event) {
        const targetBook = findBookIndex(event);
        myLibrary[targetBook].removeBook();
        updateDisplay();
    }

    function viewBookInfo(event) {
        const targetBook = findBookIndex(event);
        myLibrary[targetBook].showBookInfo();
    }

    function changeBookStatus(event) {
        const targetBook = findBookIndex(event);
        myLibrary[targetBook].checkOut();
        updateDisplay();
    }

    function findBookIndex(event) {
        let rowIndexNumber = parseInt(event.target.parentNode.dataset.indexNumber);
        if (event.target.tagName.toLowerCase() === `span`) {
            rowIndexNumber = parseInt(event.target.parentNode.parentNode.dataset.indexNumber);
        }
        return myLibrary.findIndex(book => book.bookID === rowIndexNumber);
    }

    function handleSorting(event) {
        if (event.target.innerText === ``) return;
        const sortParam = getSortParameter(event);
        const sortDirection = getSortDirection(event);
        sortLibrary(sortDirection, sortParam);
        updateDisplay();
    }

    function getSortParameter(event) {
        if (event.target.innerText === `Status`) return `checkedOut`;
        else if (event.target.innerText === `Title`) return `title`;
        else if (event.target.innerText === `Author`) return `author`;
        else if (event.target.innerText === `Cover`) return `coverType`;
        else return `BookID`;
    }

    function getSortDirection(event) {
        const sortArrow = event.target.parentNode.lastElementChild;
        const resetArrows = document.querySelectorAll(`.header-arrow`);

        for (let i = 0; i < resetArrows.length; i++) {
            if (sortArrow !== resetArrows[i]) {
                resetArrows[i].innerText = ``;
            }
        }

        if (sortArrow.innerText === `` || sortArrow.innerText === `expand_more`) {
            sortArrow.innerText = `expand_less`;
            return `ascending`;
        } else {
            sortArrow.innerText = `expand_more`;
            return `descending`;
        }
    }

    function sortLibrary(sortDirection, sortParam) {
        if (sortParam === `bookID`) {
            myLibrary = myLibrary.sort((a, b) => (a[sortParam] > b[sortParam]) ? 1 : -1);
            return;
        }

        if (sortDirection === `ascending`) {
            myLibrary = myLibrary.sort(function(a, b) {
                if (a[sortParam].toString().toLowerCase() > b[sortParam].toString().toLowerCase()) return 1;
                else if (a[sortParam].toString().toLowerCase() === b[sortParam].toString().toLowerCase()) return 0;
                else return -1;
            });
        } else if (sortDirection === `descending`) {
            myLibrary = myLibrary.sort(function(a, b) {
                if (a[sortParam].toString().toLowerCase() > b[sortParam].toString().toLowerCase()) return -1;
                else if (a[sortParam].toString().toLowerCase() === b[sortParam].toString().toLowerCase()) return 0;
                else return 1;
            });
        }
    }
    return { updateDisplay }
})();