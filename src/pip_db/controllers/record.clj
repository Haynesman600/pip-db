(ns pip-db.controllers.record
  (:require [pip-db.models.record :as model]
            [pip-db.views.advanced :as advanced]
            [pip-db.views.record :as view]
            [pip-db.ui :as ui]
            [pip-db.util :as util]))

(defn GET [request]
  (let [data (model/record ((request :params) :id))]
    (if (pos? (data :No-Of-Records-Matched))
      (view/record (assoc request :results data))
      (ui/page-404))))

(defn GET-json [request]
  (util/json-response (model/record ((request :params) :id))))
