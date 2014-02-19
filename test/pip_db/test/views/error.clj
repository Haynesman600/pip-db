(ns pip-db.test.views.error
  (:use clojure.test)
  (:require [pip-db.views.error :as dut]))

(deftest status-404
  (testing "Page produces String"
    (is (= (class (dut/status-404))
           java.lang.String))))

(deftest status-500
  (testing "Page produces String"
    (is (= (class (dut/status-500 (Exception. "Test page")))
           java.lang.String))))
