;; A set of useful utility functions, the purpose of which is to
;; provide generic helpers for tasks.
(ns pip-db.util
  (:use [pip-db.resources :only (resource)])
  (:require [clojure.string :as str]
            [clojure.data.json :as json]))

;; --------------
;; ## Environment

;; If we are in a debugging environment, then `(= debug? true)`.
(def debug? (not (str/blank? (System/getenv "DEBUG"))))

;; The port which we are serving over.
(def port (Integer/parseInt (or (System/getenv "PORT") "5000")))

;; ----------------
;; ## HTTP Requests

;; We can get the current host either from the request-map, or we just
;; generate the expected value.
(defn host
  ([] (if debug?
        (str "localhost:" (Integer/parseInt (or (System/getenv "PORT") "5000")))
        "www.pip-db.org"))
  ([request] (let [host-header ((request :headers) "host")]
               (if (str/blank? host-header) (host) host-header))))

;; The host as a URL.
(defn host-url
  ([] (str "http://" (host)))
  ([request] (str "http://" (host request))))

;; We can get the HTTP referrer either from the request-map, or we
;; just default to the host.
(defn referer
  ([]        (host-url))
  ([request] (let [referer ((request :headers) "referer")]
               (if (str/blank? referer) (host-url request) referer))))

;; Fetch the username of the signed in user, else return an empty
;; string.
(defn username [request]
  (try (((request :cookies) "pip-db") :value)
       (catch Exception e "")))

;; Returns whether the user is currently signed in.
(defn signed-in? [request]
  (not (str/blank? (username request))))

;; -------------------
;; ## Type conversions

;; A robust string to integer parser, without any gotchas. Under
;; normal circumstances, it behaves as you would expect, e.g.
;; `(= (str->int "5") 5)`. In case of error, it returns nil, e.g.
;; `(= (str->int "abcd") nil)`, or `(= (str->int nil) nil)`.
(defn str->int [string]
  (try
    (Integer/parseInt string)
    (catch NumberFormatException e nil)))

(defn is-number? [n]
  (if (nil? (str->num n)) false true))

;; It's necessary to extend the SQL Timetsamp type in order to be able
;; to JSON-ify them. See: http://stackoverflow.com/a/19164491
(extend-type java.sql.Timestamp
  json/JSONWriter
  (-write [date out]
    (json/-write (str date) out)))

;; Here we can reliably transform an arbitrary data structure into
;; JSON format.
(defn data->json [data]
  (json/write-str data))

;; -----------------
;; ## Date utilities

(def seconds-in-a-week 604800)

;; Return the current year as a number, as set by the system clock.
(defn current-year []
  (+ 1900 (.getYear (new java.util.Date))))

;; --------------------
;; ## Working with HTML

;; Returns an element which represents an embedded <style></style>
;; tag, containing the contents of the given path. Paths use the
;; `resources/public` directory as their root,
;; e.g. `/css/foo.inline.css`, which expands to
;; `resources/public/css/foo.inline.css`. By convention, any file
;; which is intended to be inlined should have the `.inline` suffix
;; appended to its name, in order to distinguish it from public CSS
;; files which are included using the `src` attribute.
(defn inline-css [path]
  [:style (resource path)])

;; Returns an element which represents an embedded <script></script>
;; tag, containing the contents of the given path. Paths use the
;; `resources/public` directory as their root,
;; e.g. `/js/foo.inline.js`, which expands to
;; `resources/public/js/foo.inline.js`. By convention, any file which
;; is intended to be inlined should have the `.inline` suffix appended
;; to its name, in order to distinguish it from public JS files which
;; are included using the `src` attribute.
(defn inline-js [path]
  [:script (resource path)])

;; We can conveniently assign arbitrary data structures to a
;; JavaScript variable in JSON notation using
;; `(json-data-var "data" {:foo "bar"})`.
(defn json-data-var [name data]
  (str "var " name " = " (data->json data)))

;; Create an inline script which assigns an arbitrary data structure
;; to a globally accessible variable in window scope.
(defn inline-data-js [name data]
  [:script (json-data-var name data)])
