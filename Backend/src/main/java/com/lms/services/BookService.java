package com.lms.services;

import com.lms.exception.BookNotFoundException;
import com.lms.model.Book;
import com.lms.repository.BookRepository;
import com.lms.repository.BorrowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowRepository borrowRepository; // Repository to check if book has been issued

    public List<Book> getAllBooks() {
        List<Book> books = new ArrayList<>();
        bookRepository.findAll().forEach(books::add);
        return books;
    }

    public Book getBookById(long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public void updateBook(Book book) {
        bookRepository.save(book);
    }

    public void deleteBook(long id) {
        if (borrowRepository.existsByBookId(id)) {  // Ensure this method exists
            throw new IllegalStateException("Cannot delete book. It is currently borrowed or has past borrow records.");
        }

        try {
            bookRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Cannot delete book. It is referenced in other records.");
        }
    }

}
