(ns pip-db.controllers.index
  (:use [compojure.core :only (defroutes GET)])
  (:require [pip-db.views.index :as view]))

(defn handler [request] (view/index request))
