package ru.unc6.promeets.controller.rest;

import ru.unc6.promeets.controller.exception.NotFoundException;
import ru.unc6.promeets.controller.exception.NotFoundResponseErrorMessage;
import ru.unc6.promeets.model.service.entity.BaseService;

import java.io.Serializable;

/**
 * Created by Vladimir on 08.05.2016.
 */
public abstract class BaseController<T, V extends Serializable> {
    protected BaseService<T, V> service;

    public BaseController(BaseService<T, V> service) {
        this.service = service;
    }


    protected void checkIsNotFoundById(V id) {
        getAndCheckIsNotFoundById(id);
    }

    protected T getAndCheckIsNotFoundById(V id) {
        T entity = service.getById(id);
        if (entity == null) {
            throw new NotFoundException().setResponseErrorMessage(new NotFoundResponseErrorMessage());
        }
        return entity;
    }

}
