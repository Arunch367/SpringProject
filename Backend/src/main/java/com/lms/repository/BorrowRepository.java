package com.lms.repository;

import com.lms.model.Borrow;
import com.lms.model.BorrowStatus;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface BorrowRepository extends CrudRepository<Borrow, Long> {

    List<Borrow> findByUserId(Long userID);
    List<Borrow> findByBookId(Long bookId);
    List<Borrow> findByUserIdAndStatusIn(Long userId, List<BorrowStatus> status);

    // ✅ New method to check if a book has been borrowed before
    boolean existsByBookId(Long bookId);
    List<Borrow> findByUserIdAndBookIdAndStatusIn(Long userId, Long bookId, List<BorrowStatus> statuses);

}
