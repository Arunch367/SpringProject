package com.lms.services;

import com.lms.model.Admin;
import com.lms.model.BookRequest;
import com.lms.model.BorrowStatus;
import com.lms.repository.BookRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookRequestService {

    @Autowired
    BookRequestRepository bookRequestRepository;

    public List<BookRequest> getAllRequests(){
        List<BookRequest> br = new ArrayList<>();
        bookRequestRepository.findAll().forEach(br::add);
        return br;
    }

    public BookRequest addRequest(BookRequest br){
        br.setStatus(BorrowStatus.REQUESTED);
        return bookRequestRepository.save(br);
    }

    public BookRequest requestById(long id){
        return bookRequestRepository.findById(id).orElseThrow();
    }
    public BookRequest findLatestRequestByBookAndUser(long bookId, long userId) {
        return bookRequestRepository.findTopByBookIdAndUserIdOrderByIdDesc(bookId, userId)
                .orElseThrow(() -> new RuntimeException("Request not found for bookId: " + bookId + " and userId: " + userId));
    }

//    public BookRequest updateRequest(BookRequest br, long adminId){
//        // get existing book request
//        BookRequest existingRequest = requestById(br.getId());
//        System.out.println(existingRequest.getStatus());
//        // set book returned status
//
//        existingRequest.setStatus(BorrowStatus.RETURNED);
//        existingRequest.setBook(br.getBook());
//        existingRequest.setUser(br.getUser());
//
//        Admin admin = new Admin();
//        admin.setId(adminId);
//        existingRequest.setAdmin(admin);
//        existingRequest.setStatus(BorrowStatus.RETURNED);
//        System.out.println(existingRequest.getStatus());
//
//        // save edited data
//        bookRequestRepository.save(existingRequest);
//
//        return existingRequest;
//    }
public BookRequest updateRequest(BookRequest br, long adminId) {
    // Fetch the latest request for this book and user
    BookRequest existingRequest = findLatestRequestByBookAndUser(br.getBook().getId(), br.getUser().getId());

    System.out.println("🟢 Request ID: " + existingRequest.getId());
    System.out.println("🔵 Existing Request Status Before Update: " + existingRequest.getStatus());

    if (existingRequest.getStatus() == BorrowStatus.REQUESTED) {
        existingRequest.setStatus(BorrowStatus.RESPONDED);
        Admin admin = new Admin();
        admin.setId(adminId);
        existingRequest.setAdmin(admin);
        bookRequestRepository.save(existingRequest);

        System.out.println("🟣 Existing Request Status After Update: " + existingRequest.getStatus());
    } else {
        System.out.println("⚠️ Status is not REQUESTED, skipping update.");
    }

    return existingRequest;
}


    public BookRequest updateRequestReturn(BookRequest br){
        // get existing book request
        BookRequest existingRequest = requestById(br.getId());

        // set book returned status
        existingRequest.setStatus(BorrowStatus.RETURNED);
        existingRequest.setBook(br.getBook());
        existingRequest.setUser(br.getUser());
        existingRequest.setAdmin(br.getAdmin());
        // save edited data
        bookRequestRepository.save(existingRequest);

        return existingRequest;
    }

    public void deleteRequest(long id){
        bookRequestRepository.deleteById(id);
    }

    // ✅ Added method to get all requests made by a user
    public List<BookRequest> getRequestsByUser(long userId) {
        return bookRequestRepository.findByUserId(userId);
    }
    public BookRequest updateRequestStatus(long requestId, String status) {
        BookRequest existingRequest = requestById(requestId);

        // Convert String to Enum
        BorrowStatus newStatus = BorrowStatus.valueOf(status.toUpperCase());
        existingRequest.setStatus(newStatus);

        return bookRequestRepository.save(existingRequest);
    }

}
