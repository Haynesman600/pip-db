(ns pip-db.views.components
  (:use [pip-db.resources :only (resource)]))

(defn inline-css [path]
  [:style (resource path)])

(defn inline-js [path]
  [:script (resource path)])

(defn search-bar [data]
  [:form {:method "GET" :action "/s" :role "search"}
   [:div.input-group
    [:input#q.form-control {:name "q"
                            :type "text"
                            :value (data :search-text)
                            :autocomplete "off"}]
    [:div.input-group-btn
     [:button.btn.btn-success {:name "a" :value "s"} "Search"]
     [:button.btn.btn-primary {:name "a" :value "a"} "Advanced"]]]])

;; Returns the path to the logo file of the given dimensions.
(defn logo-path [dimensions] (str "/img/logo-" dimensions ".png"))

;; The largest logo image, used for the homepage.
(def big-logo   [:img {:src (logo-path "640x226")
                       :alt-text "pip-db" :title "pip-db"}])

;; The smaller logo image, used in favicons and the navbar.
(def small-logo [:img {:src (logo-path "32x32")
                       :alt-text "pip-db"
                       :style "width:32px;height:32px"}])
