#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
import os

class MailSender:
    """Class for sending mail.
    Attributes:
        headers (dict): API headers
        url (str): Root API url.
    """

    def __init__(self):
        self.urlEmail = 'https://api.opencaribbean.org/api/v1/mailsender/email/template/'
    
    def sendEmailTemplate (self, fromAddr, toAddr, template, body='', ccAddr=[], bccAddr=[], subject='', attachments=[],headers={}):
        """ Function to send a simple email
        
        Args:
            fromAddr (str): Email addr from sender
            toAddr (List[str]): Emails addresses to send
            template (dict): Email template
            ccAddr (Optional[str]): Emails addresses to send copy
            bccAddr (Optional[str]): Emails addresses to send blind carbon copy
            subject (Optional[str]): Email subject
            attachments (Optional[str]): Email attachment
        Return:
            dict: Response

        Example:
            For send email:
            >>> fromAddr = 'sender@domain.local'
            >>> toAdd = addresse@domain.local
            >>> template = {'url': 'https://some.domain.local/someimage.jpg', 'vars' : {}}
            >>> subject = 'Important'
            >>> sendEmailTemplate(fromAddr,toAddr,template,subject=subject)
            {'content': 'The resource was registered successfully.', 'status_code': 201}
        """
        head = {"from": fromAddr, "to": toAddr,"cc": ccAddr, "bcc": bccAddr }
        details = { "attachments": attachments, "subject": subject, "template": template }
        data = { "details": details, "head": head,"headers":headers}    
        return ExecuteQuery().Query(self.urlEmail,'POST',data)


class BookableAndBooking:
    """ Calendar and reservation management
    Attributes:
        urlBookables (str): Root API bookables url.
        urlBooing (str): Root API booking url.
    """
            
    def __init__(self):
        self.urlBookables = 'https://api.opencaribbean.org/api/v1/booking/bookables/'
        self.urlBookings = 'https://api.opencaribbean.org/api/v1/booking/bookings/'

    def createBookable(self, dateEnd, dateStart, appId, locationId, resourceId, userId, isEnable=True):
        """ Function to create bookable
        Args:        
            dateend (datetime): Date end bookable
            datestart (datetime): Date start bookable
            idapp (str): Application ID
            idlocation (str): Location ID
            idresource (str): Resource ID,
            iduser  (str): Rate ID, default -1
            isenabled (bool): Enable or disable
        Return:
            dict: Response
        Example:
            For create bookable:
            >>> dateEnd = '2019-05-09T02:34:51.904Z'
            >>> dateStart = '2019-05-09T02:34:51.904Z'
            >>> appId = 'myapp'
            >>> locationId = 'upp9hmoBuHxVekCPqKpR'
            >>> resourceId = 'uZp9hmoBuHxVekCPp6r'
            >>> userId = 'arawaks'
            >>> createBookable(dateEnd,dateStart,appId,locationId,resourceId,userId)
            {'content': 'The bookable was registered successfully.', 'status_code': 201}
        """
        data = { "dateend": dateEnd, "datestart": dateStart, "idapp": appId, "idlocation" : locationId, "idrate": "-1", "idresource" : resourceId, "iduser": userId, "isenabled" : isEnable}    
        return ExecuteQuery().Query(self.urlBookables,'POST',data)
    
    def getBookableById(self,bookableId):
        """Function to get a bookable by id
        Args:
            bookableId (str): Bookable id to get
        Return:
            dict: Response
        Example:
            >>> bookableId = 'fff87697-9f6b-4408-a489-bdeabd5b6234'
            >>> getBookableById(bookableId)
            {
                "id":"b65f10f9-5d08-4225-b09e-a5e689688f9e", "idapp":"eedsg568yzx", "iduser":"cvbntyuiy",
                "idrate":"-1", "idresource":"fghjkliuy", "idlocation":"ertyuiooooop", "isenabled":true,
                "datestart":"2019-05-09T02:34:51.904+0000", "dateend":"2019-05-20T02:34:51.904+0000",
                "createdAt":"2019-05-10T04:30:13.180+0000","updatedAt":"2019-05-10T04:30:13.180+0000"
            }
        """
        url = self.urlBookables + bookableId
        return ExecuteQuery().Query(url,'GET')  
       
    def deleteBookableById(self,bookableId):
        """Function to del a bookable by id
        Args:
            bookableId (str): Bookable id to delete
        Return:
            dict: Response
        Example:
            >>> bookableId = 'fff87697-9f6b-4408-a489-bdeabd5b6234'
            >>> delBookableById(bookableId)
            {'status': 204, 'message': 'No content'}
        """
        url = self.urlBookables + bookableId
        return ExecuteQuery().Query(url,'DELETE')
    
    def getFreeBookablesByIntervalDate(self,resourceId,startDate,endDate):
        """List all free bookables moments for a resource between two dates
        Args:
            resourceId  (str): Resource id to search
            startDate   (str): Start date
            endDate     (str): End date
        Return:
            dict: Response
        Example:
            >>> resourceId = 'j8sEimoBSf6a6E5BcOFf'
            >>> startDate = '2019-01-03T04:01:51.000+0000'
            >>> dateEnd = '2019-01-05T04:01:51.000+0000'
            >>> getFreeBookablesByIntervalDate(bookableId,startDate,endDate)
            
        """
        url = self.urlBookables+'{0}/{1}/{2}/'.format(resourceId,startDate,endDate)
        return ExecuteQuery().Query(url, 'GET')
    
    def createBooking(self,bookableId,dateEnd,dateStart,appId,resourceId,userId,status):
        """ Create a booking based on bookable id
        Args:
            bookableId   (str): Bookable id
            dateend (datetime): Date end booking 
            datestart (datetime): Date start booking
            idapp (str): Application ID
            idresource (str): Resource ID,
            iduser  (str): Rate ID, default -1
            status (str): Status of booking
        Return:
            dict: Code and value of response
        Example:
            For create booking:
            >>> bookableId = 'fff87697-9f6b-4408-a489-bdeabd5b6234'
            >>> dateEnd = '2019-05-09T02:34:51.904Z'
            >>> dateStart = '2019-05-09T02:34:51.904Z'
            >>> appId = 'myapp'
            >>> resourceId = 'uZp9hmoBuHxVekCPp6r'
            >>> userId = 'arawaks'
            >>> status = 'CREATED'
            >>> createBookable(bookableId,dateEnd,dateStart,appId,resourceId,userId,status)
        """
        data = {
            "bookableId":bookableId,
            "dateend": dateEnd,
            "datestart": dateStart,
            "idapp" : appId,
            "idresource" : resourceId,
            "iduser": userId,
            "status" : status
            }    
        return ExecuteQuery().Query(self.urlBookings,'POST',data)
        
    def updateBooking(self,bookingId,bookableId,dateEnd,dateStart,appId,resourceId,userId,status='CREATED'):
        """ Update a Booking
        Args:
            bookinId     (str): Booking id
            bookableId   (str): Bookable id
            dateend (datetime): Date end booking 
            datestart (datetime): Date start booking
            idapp (str): Application ID
            idresource (str): Resource ID,
            iduser  (str): Rate ID, default -1
            status (str): Status of booking
        Return:
            dict: Response
        Example:
            For update Booking:
            >>> bookingId = '084933e1-d175-4f96-91c6-3f081a2b5be1'
            >>> bookableId = 'fff87697-9f6b-4408-a489-bdeabd5b6234'
            >>> dateEnd = '2019-05-09T02:34:51.904Z'
            >>> dateStart = '2019-05-09T02:34:51.904Z'
            >>> appId = 'myapp'
            >>> resourceId = 'uZp9hmoBuHxVekCPp6r'
            >>> userId = 'arawaks'
            >>> status = 'CREATED'
            >>> createBookable(bookableId,dateEnd,dateStart,appId,resourceId,userId,status)
        """
        data = {
            "bookableId":bookableId,
            "dateend": dateEnd,
            "datestart": dateStart,
            "idapp" : appId,
            "idresource" : resourceId,
            "iduser": userId,
            "status" : status
            }
        url = self.urlBookings + bookingId
        return ExecuteQuery().Query(url,'PUT',data)

    def getBookingById(self,bookingId):
        """ Get a booking by id
        Args:
            bookingId   (str): Booking id
        Return:
            dict: Code and value of response
        Example:
            >>> bookingId = 'fff87697-9f6b-4408-a489-bdeabd5b6234'
            >>> getBookingById(bookingId)

        """
        url = self.urlBookings + bookingId
        return ExecuteQuery().Query(url,'GET')
    
    def delBookingById(self,bookingId):
        """ Delete a booking by id
        Args:
            bookingId   (str): Booking id
        Return:
            dict: Code and value of response
        Example:
            >>> bookingId = 'fff87697-9f6b-4408-a489-bdeabd5b6234'
            >>> delBookingById(bookingId)
        """
        url = self.urlBookings + bookingId
        return ExecuteQuery().Query(url,'DELETE')

    def verifyBookingExist(self,bookingId):
        """  Verify id booking exist by id
        Args:
            bookingId   (str): Booking id
        Return:
            dict: Code and value of response
        Example:
            >>> bookingId = 'fff87697-9f6b-4408-a489-bdeabd5b6234'
            >>> verifyIdBookingExist(bookingId)
        """
        url = self.urlBookings + 'exists/' + bookingId
        return ExecuteQuery().Query(url,'GET')

    def getHistoryBookingsUser(self,userId):
        """ List all history bookings by user
        Args:
            userId   (str): User id
        Return:
            dict: Code and value of response
        Example:
            >>> userId = 'fff87697-9f6b-4408-a489-bdeabd5b6234'
            >>> getHistoryBookingsUser(bookingId)
        """
        url = self.urlBookings + 'history?iduser=' + userId
        return ExecuteQuery().Query(url,'GET')


class Review:
    """ Class for evaluation and state of resources
    Attributes:
        urlEvaluation (str): Root API evaluation url.  
    """

    def __init__(self):
        self.urlEvaluation = "https://api.opencaribbean.org/api/v1/review/evaluations/"
        self.urlState = 'https://api.opencaribbean.org/api/v1/review/states/'
        
    def createEvaluation(self,dateEval,appId,resourceId,userId,value):
        """Register an evaluation
        Args:
            dateEval   (str): Date and time
            appId      (str): Id app to evaluate
            resourceId (str): Id resource to evaluate
            userId     (str): Id user to evaluate
            value      (int): Value of evaluation
        Return:
            dict: Response
        Example:
            >>> dateEval = '2019-05-11T20:19:06.000+0000'
            >>> appId = 'payload'
            >>> resourceId = 'ZadDi2oBvhGfKisL61PE'
            >>> userId = 'arawaks'
            >>> value = 10
            >>> createEvaluation(dateEval,appId,resourceId,userId,value)
            {
                "id":"8KfVqGoBvhGfKisLFVcb",
                "idResource":"ZadDi2oBvhGfKisL61PE",
                "idApp":"payload",
                "idUser":"arawaks",
                "value":10,
                "date":"2019-05-11T20:19:06.000+0000"
            }
        """
   
        data = {"date":dateEval, "idApp":appId, "idResource": resourceId,"idUser":userId,"value":value}
        return ExecuteQuery().Query(self.urlEvaluation,'POST',data)

    def deleteEvaluation(self,evaluationId):
        """Delete an evaluation.
        Args:
            evaluationId    (str): Evaluation id to delete
        Return:
            dict: Response
        Example:
            >>> evaluationId = '8KfVqGoBvhGfKisLFVcb'
            >>> deleteEvaluation(evaluationId)
            {'status': 204, 'message': 'No content'}
        """
        url = self.urlEvaluation + evaluationId
        return ExecuteQuery().Query(url,'DELETE')

    def getEvaluationByResourceId(self,resourceId):
        """Get the evaluation average for a resource
        Args:
            resourceId  (str): Resource id to search
        Return:
            float: Resource average
        Example:
            >>> resourceId = '670sxm2BvhGfkkd53Vcb'
            >>> deleteEvaluation(resourceId)
            10.0
        """
        url = self.urlEvaluation +'resource/{0}'.format(resourceId)
        return ExecuteQuery().Query(url,'GET')

    def getEvaluationAssignedToResourceByUserId(self,resourceId,userId):
        """Get the evaluation asigned to a resource by a user.
        Args:
            resourceId      (str): Resource id
            userId          (str): User id
        Return:
            dict: Response
        Example:
            >>> resourceId = 'ZadDi2oBvhGfKisL61PE'
            >>> userId = 'C6fbt2oBvhGfKisL8ViD'
            >>> getEvaluationAssignedToResourceByUserId(resourceId,userId)
            {
                "id":"C6fbt2oBvhGfKisL8ViD",
                "idResource":"ZadDi2oBvhGfKisL61PE",
                "idApp":"payload",
                "idUser":"arawaks",
                "value":10,
                "date":"2019-05-11T20:19:06.000+0000"
            }
        """
        url = self.urlEvaluation + 'resource/{0}/user/{1}'.format(resourceId,userId)
        return ExecuteQuery().Query(url,'GET')
    
    def createState(self,dateState,appId,resourceId,userId,value):
        """Register an evaluation
        Args:
            dateEval   (str): Date and time
            appId      (str): Id app
            resourceId (str): Id resource
            userId     (str): Id user
            value      (int): Value of state. Available values : LIKE, LOVE, AWESOME, SAD, ANGRY, RECOMENDED 
        Return:
            dict: Response
        Example:
            >>> dateState = '2019-05-11T20:19:06.000+0000'
            >>> appId = 'payload'
            >>> resourceId = 'P8M-g2oBJEqmyUrk9qoG'
            >>> userId = 'arawaks'
            >>> value = 'LIKE'
            >>> createState(dateState,appId,resourceId,userId,value)
            {
                "id":"8qfsqGoBvhGfKisLyleX"
                ,"idResource":"P8M-g2oBJEqmyUrk9qoG"
                ,"idApp":"payload",
                "idUser":"arawaks",
                "value":"LIKE",
                "date":"2019-05-11T20:19:06.000+0000"
            }
        """
        data = {"date":dateState, "idApp":appId, "idResource": resourceId,"idUser":userId,"value":value}
        return ExecuteQuery().Query(self.urlState,'POST',data)
        
    def deleteState(self,stateId):
        """Delete a state
        Arg:
            stateId    (srt): State id to delete
        Return:
            dict: Response
        Example:
            >>> stateId = '8qfsqGoBvhGfKisLyleX'
            >>> deleteState(stateId)
            {'status': 204, 'message': 'No content'}
        """
        url = self.urlState + stateId
        return ExecuteQuery().Query(url,'DELETE')
    
    def getStateByResourceId(self,resourceId):
        """Get the state average for a resource
        Arg:
            resourceId  (str): Resource id
        Output:
            dict: Response
        Example:
            >>> resourceId = ''
            >>> getStateByResourceId(resourceId)
            {
                "resourceId":"P8M-g2oBJEqmyUrk9qoG",
                "statesValues":
                    [
                        {"state":"LIKE","quantity":1},
                        {"state":"LOVE","quantity":0},
                        {"state":"AWESOME","quantity":0},
                        {"state":"SAD","quantity":0},
                        {"state":"ANGRY","quantity":0},
                        {"state":"RECOMENDED","quantity":0}
                    ]
            }
        """
        url = self.urlState + 'resource/{0}'.format(resourceId)
        return ExecuteQuery().Query(url,'GET')

    def getStateAssignedToResourceByUserId(self,resourceId,userId):
        """Get the state asigned to a resource by a user.
        Args:
            resourceId      (str): Resource id
            userId          (str): User id
        Return:
            dict: Response
        Example:
            >>> resourceId = 'ZadDi2oBvhGfKisL61PE'
            >>> userId = 'C6fbt2oBvhGfKisL8ViD'
            >>> getStatAssignedToResourceByUserId(resourceId,userId)
            {
                "id":"DKfxt2oBvhGfKisLS1jE",
                "idResource":"P8M-g2oBJEqmyUrk9qoG",
                "idApp":"payload",
                "idUser":"arawaks",
                "value":"LIKE",
                "date":"2019-05-11T20:19:06.000+0000"
            }
        """
        url = self.urlState + 'resource/{0}/user/{1}'.format(resourceId,userId)
        return ExecuteQuery().Query(url,'GET')    

class Entities:
    """ Class entity
    """

    def __init__(self):
        self.urlEntity = 'https://api.opencaribbean.org/api/v1/resource/entities'

    def getAllEntities(self,name,page,size):
        """Get all resourses.
        Args:
            name    (str): Name
            page    (str): Page
            size    (str): Size
        Return:
            dict: Response
        Example:
            >>> name = 'Corp'
            >>> page = '1'
            >>> size = '10'
            getAllEntities(name,page,size)
            {
                "size":10,
                "page":1,
                "totalElements":0,
                "countPages":0,
                "hasNext":false,
                "hasPrevious":true,
                "content":[],
                "first":false,
                "last":true
            }
        """
        url = self.urlEntity + '?name={0}&page={1}&size={2}'.format(name,str(page),str(size))
        return ExecuteQuery().Query(url,'GET')

    def getEntity(self,entityId):
        """Get resource.
        Arg:
            entityId    (str): Entity id to search
        Return:
            dict: Response
        Example:
            >>> entityId = 'DacFuGoBvhGfKisLJVjK'
            >>> getEntity(entityId)
            {
                "id":"DacFuGoBvhGfKisLJVjK",
                "createdAt":"Tue May 14 20:25:06 UTC 2019",
                "updatedAt":"Tue May 14 20:25:06 UTC 2019",
                "deletedAt":"",
                "deleted":false,
                "active":true,
                "bookeable":true,
                "__type":"Corp"
            }
        """
        url = self.urlEntity + '/{0}'.format(entityId)
        return ExecuteQuery().Query(url,'GET')

    def existEntity(self,entityId):
        """Verify if resource exist
        Arg:
            entityId   (str): Entity id to verify
        Return:
            bool: true or false
        Example:
            >>> entityId = 'DacFuGoBvhGfKisLJVjK'
            >>> existEntity(entityId)
            true
        """
        url = self.urlEntity + '/exists/{0}'.format(entityId)
        return ExecuteQuery().Query(url,'GET')
    
    def availableEntities(self,page,size):
        """Get availables entities.
        Args:
            page    (str): Page
            size    (str): Size
        Return:

        Example:
            >>> page = '1'
            >>> size = '1'
            >>> availableEntities(page,size)
            {
                "size":10,
                "page":1,
                "totalElements":6,
                "countPages":1,
                "hasNext":false,
                "hasPrevious":true,
                "content":[],
                "first":false,
                "last":true
            }
        """
        url = self.urlEntity + '/find?page={0}&size={1}'.format(page,size)
        return ExecuteQuery().Query(url,'GET')

    def findByName(self,name):
        """Get if entity is present.
        Arg:
            name    (str): Name of entity to verify
        Return:
            bool: true or false
        Example:
            >>> name = 'Corp'
            findByName(name)

            true
        """
        url = self.urlEntity + '/find/name?name={0}'.format(name)
        return ExecuteQuery().Query(url,'GET')

    def searchPaginate(self,page,query,size):
        """Search using full text search paginate
        Args:
            page    (str): Pages to show
            query   (str): Query to search
            size    (str): Size to paginate
        Return:
            dict: Response
        Example:
            >>> page = '1'
            >>> query = 'Corp'
            >>> search = 1
            searchPaginate(page,query,se)
            {
                "size":1,
                "page":1,
                "totalElements":0,
                "countPages":0,
                "hasNext":false,
                "hasPrevious":true,
                "content":[],
                "first":false,
                "last":true
            }
        """
        url = self.urlEntity + '/page/search?page=' + page + '&query=' + query + '&size=' +size
        return ExecuteQuery().Query(url,'GET')
    
    def search(self,query):
        """ Search using full text search
        """
        url = self.urlEntity + '/search?query=' + query
        print url
        return ExecuteQuery().Query(url,'GET')


class Location:
    """ Class for Location, country and maps
    Attributes:
        urlLocation (str): Root API location url.  
        urlCountry  (str): Root API country url.  
        urlMaps     (str): Root API maps url.  
    """

    def __init__(self):
        self.urlLocation = 'https://api.opencaribbean.org/api/v1/location/locations/'
        self.urlCountry = 'https://api.opencaribbean.org/api/v1/location/countries/'
        self.urlMaps = 'https://api.opencaribbean.org/api/v1/location/maps/'

    def getCountries(self):
        """ Get all countries available
        Return:
            Array: Response
        Example:
            >>> getCountries()
        Output:
            [{
                "id": "v6cNi2oBvhGfKisLpU4m",
                "name": "Argentina","code": "AR",
                "capital": "Buenos Aires",
                "timezones": [
                                "America/Argentina/Buenos_Aires",
                                "America/Argentina/Cordoba",
                                "America/Argentina/Salta",
                                "America/Argentina/Jujuy",
                                "America/Argentina/Tucuman",
                                "America/Argentina/Catamarca",
                                "America/Argentina/La_Rioja",
                                "America/Argentina/San_Juan",
                                "America/Argentina/Mendoza",
                                "America/Argentina/San_Luis",
                                "America/Argentina/Rio_Gallegos",
                                "America/Argentina/Ushuaia"
                            ], 
                "latitude": -34,
                "longitude": -64
            }]
        """
        return ExecuteQuery().Query(self.urlCountry,'GET')

    def getCountry(self,countryId):
        """Get country by id.
        Args:
            countryId       (str): Country id
        Return:
            dict: Response
        Example:
            >>> countryId = 'v6cNi2oBvhGfKisLpU4m'
            >>> getContry(countryId)
        Output:
            {
                "id": "v6cNi2oBvhGfKisLpU4m",
                "name": "Argentina","code": "AR","capital": "Buenos Aires",
                "timezones": [
                                "America/Argentina/Buenos_Aires",
                                "America/Argentina/Cordoba",
                                "America/Argentina/Salta",
                                "America/Argentina/Jujuy",
                                "America/Argentina/Tucuman",
                                "America/Argentina/Catamarca",
                                "America/Argentina/La_Rioja",
                                "America/Argentina/San_Juan",
                                "America/Argentina/Mendoza",
                                "America/Argentina/San_Luis",
                                "America/Argentina/Rio_Gallegos",
                                "America/Argentina/Ushuaia"
                            ], 
                "latitude": -34,
                "longitude": -64
            }
        """
        url = self.urlCountry + countryId
        return ExecuteQuery().Query(url,'GET')
   
    def createLocation(self,appId,name,resourceId='',location='',street='',city='',state='',community='',region='',countryId='',timeZone=[],phoneNumbers=[],fax='',email='',tpdco=''):
        """ Register a new location
        Args:
            appId            (str): App id
            name             (str): New location name
            resourceId       (str): Resource id
            location         (dict): Latitude and longitude
            street           (str): Street of resource
            city             (str): City of resource
            state            (str): State of resource 
            community        (str): Community of resource
            region           (str): Region of resource
            country          (dict): Country data location
            timeZone     List(str): Time zone of location
            phoneNumbers List(str): Phone number
            fax              (str): Fax number
            email            (str): Email address
            tpdco            (str): TPDCO
        Return:
            dict: Response
        Example:
            >>> appId = 'playtour'
            >>> name = 'Test Company'
            >>> resourceId = 'Jac8i2oBvhGfKisLL1H2'
            >>> location = {"lat":18.416753,"lon":-77.0252}
            >>> street = 'Main Street'
            >>> city = 'My City'
            >>> state = 'My State'
            >>> community = 'My community'
            >>> region = 'My Region'
            >>> country = {
            ....       "id":"4adYmmoBvhGfKisLdVf3",
            ....       "name":"Cuba",
            ....       "code":"CU",
            ....       "capital":"Habana",
            ....       "timezones":[],
            ....       "latitude":23.2342,
            ....       "longitude":-83.23648
                   }
            >>> timeZone = []
            >>> phoneNumbers = []
            >>> fax = ''
            >>> email = ''
            >>> tpdco = ''
            >>> createLocation(appId,name,resourceId,location,street,city,state,community,region,countryId,timeZone,phoneNumbers,fax,email,tpdco)
            {
                "id":"EKcjuGoBvhGfKisLG1hv",
                "appId":"playtour",
                "name":"Test Company",
                "resourceId":"Jac8i2oBvhGfKisLL1H2",
                "location":{"lat":18.416753,"lon":-77.0252},
                "street":"Main Street",
                "city":"My City",
                "state":"My State",
                "community":"My community",
                "region":"My Region",
                "country":{
                    "id":"4adYmmoBvhGfKisLdVf3",
                    "name":"Cuba",
                    "code":"CU",
                    "capital":"Habana",
                    "timezones":[],
                    "latitude":23.2342,
                    "longitude":-83.23648
                    },
                "timeZone":[],
                "phoneNumbers":[],
                "fax":"",
                "email":"",
                "tpdco":""
            }
        """
        data = {'appId':appId,'name':name,'resourceId':resourceId,'location':location,'street':street,'city':city,
                'state':state,'community':community,'region':region,'country':countryId,'timeZone':timeZone,
                'phoneNumbers':phoneNumbers,'fax':fax,'email':email,'tpdco':tpdco}
        return ExecuteQuery().Query(self.urlLocation,'POST',data)

    def updateLocation(self,locationId,appId,name,resourceId='',location='',street='',city='',state='',community='',region='',countryId='',timeZone=[],phoneNumbers=[],fax='',email='',tpdco=''):
        """ Update a location 
        Args:
            locationId       (str): Location id to update
            appId            (str): App id
            name             (str): New location name
            resourceId       (str): Resource id
            location         (dict): Latitude and longitude
            street           (str): Street of resource
            city             (str): City of resource
            state            (str): State of resource 
            community        (str): Community of resource
            region           (str): Region of resource
            country          (dict): Country data location
            timeZone     List(str): Time zone of location
            phoneNumbers List(str): Phone number
            fax              (str): Fax number
            email            (str): Email address
            tpdco            (str): TPDCO
        Return:
            dict: Response
        Example:
            >>> appId = 'playtour'
            >>> name = 'Test Company NEW NAME'
            >>> resourceId = 'Jac8i2oBvhGfKisLL1H2'
            >>> location = {"lat":18.416753,"lon":-77.0252}
            >>> street = 'Main Street'
            >>> city = 'My City'
            >>> state = 'My State'
            >>> community = 'My community'
            >>> region = 'My Region'
            >>> country = {
            ....       "id":"4adYmmoBvhGfKisLdVf3",
            ....       "name":"Cuba",
            ....       "code":"CU",
            ....       "capital":"Habana",
            ....       "timezones":[],
            ....       "latitude":23.2342,
            ....       "longitude":-83.23648
                   }
            >>> timeZone = []
            >>> phoneNumbers = []
            >>> fax = ''
            >>> email = ''
            >>> tpdco = ''
            >>> createLocation(appId,name,resourceId,location,street,city,state,community,region,countryId,timeZone,phoneNumbers,fax,email,tpdco)
            {
                "id":"EKcjuGoBvhGfKisLG1hv",
                "appId":"playtour",
                "name":"Test Company NEW NAME",
                "resourceId":"Jac8i2oBvhGfKisLL1H2",
                "location":{"lat":18.416753,"lon":-77.0252},
                "street":"Main Street",
                "city":"My City",
                "state":"My State",
                "community":"My community",
                "region":"My Region",
                "country":{
                    "id":"4adYmmoBvhGfKisLdVf3",
                    "name":"Cuba",
                    "code":"CU",
                    "capital":"Habana",
                    "timezones":[],
                    "latitude":23.2342,
                    "longitude":-83.23648
                    },
                "timeZone":[],
                "phoneNumbers":[],
                "fax":"",
                "email":"",
                "tpdco":""
            }
        """
        data = {'appId':appId,'name':name,'resourceId':resourceId,'location':location,'street':street,'city':city,
                'state':state,'community':community,'region':region,'country':countryId,'timeZone':timeZone,
                'phoneNumbers':phoneNumbers,'fax':fax,'email':email,'tpdco':tpdco}
        url = self.urlLocation + locationId
        return ExecuteQuery().Query(url,'PUT',data)

    def deleteLocation(self,locationId):
        """ Delete location
        Arg:
            locationId      (str): Location id to delete
        Return:
            dict: Response
        Example:
            >>> locationId = 'E6cvuGoBvhGfKisLoFi_'
            >>> deleteLocation(locationId)
            {'status': 204, 'message': 'No content'}
        """
        url = self.urlLocation + '{id}?id=' + locationId
        return ExecuteQuery().Query(url,'DELETE')

    def getLocationByCountry(self,countryId):
        """ get location by country id
        Arg:
            countryId       (str): Country id to search locations
        Return:
            Array: List of location
        Example:
            >>> countryId = '4adYmmoBvhGfKisLdVf3'
            >>> getLocationByCountry(countryId)
            [{
                "id": "Kqc5i2oBvhGfKisL3lAL",
                "appId": "playtour",
                "name": "WATERSPORTS ENTERPRISE",
                "resourceId": "Kac5i2oBvhGfKisL3VCx",
                "location": {
                "lat": 18.416753,
                "lon": -77.0252
                },
                "street": "DOCTORS CAVE BATHING CLUB Mailing Address: P.O. BOX 552 OCHO RIOS, ST.ANN",
                "city": "",
                "state": "",
                "community": "",
                "region": "MONTEGO BAY",
                "country": {
                "id": "Jacdi2oBvhGfKisLpE9_",
                "name": "Jamaica",
                "code": "JM",
                "capital": "Kingston",
                "timezones": [
                    "America/Jamaica"
                ],
                "latitude": 18.25,
                "longitude": -77.5
                },
                "timeZone": [],
                "phoneNumbers": [],
                "fax": "974-0665, 974-5042",
                "email": "",
                "tpdco": ""
            }]

        """
        url = self.urlLocation + 'by/country/{0}'.countryId
        return ExecuteQuery().Query(url,'GET')

    def getLocationByResource(self,resourceId):
        """ Get location for resource
        Arg:
            resourceId      (srt): Resource id
        Return:
            dict: Response
        Example:
            >>> resourceId = 'Kac5i2oBvhGfKisL3VCx'
            >>> getLocationByResource(resourceId)
            {
                "id": "Kqc5i2oBvhGfKisL3lAL",
                "appId": "playtour",
                "name": "WATERSPORTS ENTERPRISE",
                "resourceId": "Kac5i2oBvhGfKisL3VCx",
                "location": {
                "lat": 18.416753,
                "lon": -77.0252
                },
                "street": "DOCTORS CAVE BATHING CLUB Mailing Address: P.O. BOX 552 OCHO RIOS, ST.ANN",
                "city": "",
                "state": "",
                "community": "",
                "region": "MONTEGO BAY",
                "country": {
                "id": "Jacdi2oBvhGfKisLpE9_",
                "name": "Jamaica",
                "code": "JM",
                "capital": "Kingston",
                "timezones": [
                    "America/Jamaica"
                ],
                "latitude": 18.25,
                "longitude": -77.5
                },
                "timeZone": [],
                "phoneNumbers": [],
                "fax": "974-0665, 974-5042",
                "email": "",
                "tpdco": ""
            }
        """
        url = self.urlLocation + 'by/resource/' + resourceId
        return ExecuteQuery().Query(url,'GET')
    
    def nearLocation(self,originLat,originLon,destinyLat,destinyLon):
        """ Get the places list near to a location
        Args:
            originLat       (str): Origin Latitude
            originLon       (str): Origin Longitude
            destinyLat      (str): Destiny Latitude 
            destinyLon      (str): Destiny Longitude
        Return:
            dict: Response
        Example:
            >>> originLat = '23.00000'
            >>> originLon = '83.00000'
            >>> destinyLat = '23.50000'
            >>> destinyLon = '82.50000'
            >>> nearLocation(originLat,originLon,destinyLat,destinyLon)
        """
        url = self.urlMaps+'directions/{0}/{1}/{2}/{3}'.format(originLat,originLon,destinyLat,destinyLon)
        return ExecuteQuery().Query(url,'GET')

    def getPlace(self,placeId):
        """ Get info for places id
        Args:
            placeId     (str): PLace id
        Return:
            dict: Response
        Example:
            >>> placeId = 'EisxMyBNYXJrZXQgU3RyZWV0LCBXaWxtaW5ndG9uLCBOQyAyODQwMSwgVVNB'
            >>> getPlace(placeId)
            {
            "addressComponents": [
                {
                "longName": "13",
                "shortName": "13",
                "types": [
                    "STREET_NUMBER"
                ]
                },
                {
                "longName": "Market Street",
                "shortName": "Market St",
                "types": [
                    "ROUTE"
                ]
                },
                {
                "longName": "Historic District",
                "shortName": "Historic District",
                "types": [
                    "NEIGHBORHOOD",
                    "POLITICAL"
                ]
                },
                {
                "longName": "Wilmington",
                "shortName": "Wilmington",
                "types": [
                    "LOCALITY",
                    "POLITICAL"
                ]
                },
                {
                "longName": "Wilmington",
                "shortName": "Wilmington",
                "types": [
                    "ADMINISTRATIVE_AREA_LEVEL_3",
                    "POLITICAL"
                ]
                },
                {
                "longName": "New Hanover County",
                "shortName": "New Hanover County",
                "types": [
                    "ADMINISTRATIVE_AREA_LEVEL_2",
                    "POLITICAL"
                ]
                },
                {
                "longName": "North Carolina",
                "shortName": "NC",
                "types": [
                    "ADMINISTRATIVE_AREA_LEVEL_1",
                    "POLITICAL"
                ]
                },
                {
                "longName": "United States",
                "shortName": "US",
                "types": [
                    "COUNTRY",
                    "POLITICAL"
                ]
                },
                {
                "longName": "28401",
                "shortName": "28401",
                "types": [
                    "POSTAL_CODE"
                ]
                }
            ],
            "adrAddress": "<span class=\"street-address\">13 Market St</span>, <span class=\"locality\">Wilmington</span>, <span class=\"region\">NC</span> <span class=\"postal-code\">28401</span>, <span class=\"country-name\">USA</span>",
            "formattedAddress": "13 Market St, Wilmington, NC 28401, USA",
            "formattedPhoneNumber": null,
            "geometry": {
                "bounds": null,
                "location": {
                "lat": 34.23544330000001,
                "lng": -77.94935509999999
                },
                "locationType": null,
                "viewport": {
                "northeast": {
                    "lat": 34.2367348302915,
                    "lng": -77.94799896970848
                },
                "southwest": {
                    "lat": 34.2340368697085,
                    "lng": -77.9506969302915
                }
                }
            },
            "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
            "internationalPhoneNumber": null,
            "name": "13 Market St",
            "openingHours": null,
            "photos": null,
            "placeId": "ChIJgUbEo8cfqokR5lP9_Wh_DaM",
            "scope": "GOOGLE",
            "plusCode": {
                "globalCode": "876463P2+57",
                "compoundCode": "63P2+57 Wilmington, NC, United States"
            },
            "permanentlyClosed": false,
            "altIds": null,
            "priceLevel": null,
            "rating": 0,
            "reviews": null,
            "types": [
                "STREET_ADDRESS"
            ],
            "url": "https://maps.google.com/?q=13+Market+St,+Wilmington,+NC+28401,+USA&ftid=0x89aa1fc7a3c44681:0xa30d7f68fdfd53e6",
            "utcOffset": -240,
            "vicinity": "Wilmington",
            "website": null,
            "htmlAttributions": []
            }
        """
        url = self.urlMaps + '/places/{0}'.format(placeId)
        return ExecuteQuery().Query(url,'GET')


class Claim:
    """ Class to claim resources
    Attributes:
        urlClaim       (str): Root API location url.
        urlClaimForms  (str): Root API location url. 
    """


    def __init__(self):
        self.urlClaim = 'https://api.opencaribbean.org/api/v1/claim/claims/'
        self.urlClaimForms = 'https://api.opencaribbean.org/api/v1/claim/claimforms/'


    def createClaim(self,appId,currentOwnerId,resourceId,userClaimerId):
        """ Register a claim over a resource
        Args:
            appId           (str): App id
            currentOwnerId  (str): Id current owner
            resourceId      (str): Id resource
            userClaimerId   (str): Id user claimer
        Return:
            dict: Response
        Example:
            >>> userClaimerId = 'playtour'
            >>> currentOwnerId = 'dfr455657ytfhgf'
            >>> resourceId = 'Kac5i2oBvhGfKisL3VCx'
            >>> userClaimerId = 'weweer44dd22da3h'
            >>> createClaim(appId,currentOwnerId,resourceId,userClaimerId)
            {
                "id":"d03af37e-4233-4255-9f8a-d7fef41582f7",
                "idApp":"playtour",
                "idResource":"Kac5i2oBvhGfKisL3VCx",
                "idCurrentOwner":"dfr455657ytfhgf",
                "idUserClaimer":"weweer44dd22da3h",
                "claimedAt":"2019-05-14T21:36:10.077Z",
                "claimStatus":"CLAIMED"
            }
        """
        data = {'idApp':appId,'idCurrentOwner':currentOwnerId,'idResource':resourceId,'idUserClaimer':userClaimerId}
        return ExecuteQuery().Query(self.urlClaim,'POST',data)
    
    def getClaimByUser(self,resourceId,userId):
        """ Get claim for a resource request by user
        Arg:
            resourceId  (str): Resource id
            userId      (str): User id
        Return:
            dict: Response
        Example:
            >>> resourceId = 'Kac5i2oBvhGfKisL3VCx'
            >>> userId = 'weweer44dd22da3h'
            >>> getClaimByUser(resourceId,userId)
            {
                "id":"d03af37e-4233-4255-9f8a-d7fef41582f7",
                "idApp":"playtour",
                "idResource":"Kac5i2oBvhGfKisL3VCx",
                "idCurrentOwner":"dfr455657ytfhgf",
                "idUserClaimer":"weweer44dd22da3h",
                "claimedAt":"2019-05-14T21:36:10.077Z",
                "claimStatus":"CLAIMED"
            }
        """ 
        url = self.urlClaim+'/{0}/{1}'.format(resourceId,userId)
        return ExecuteQuery().Query(url,'GET')



    def createClaimForm(self,addressClaimer,claimedAt,emailClaimer,fullNameClaimer,claimerId,userClaimerId,imageEvidence,phoneClaimer,reason):
        """ Fill a form over claim
        Args:
            addressClaimer      (str): Address claimer
            claimedAt           (str): Date time
            emailClaimer        (str): Email claimer
            fullNameClaimer     (str): Full name
            idClaimer           (str): Claimer id
            idUserClaimer       (str): User claimer id
            imageEvidence       (str): Image evidence
            phoneClaimer        (str): Phone number
            reason              (str): Reason
        Return:
            dict: Response
        Example:
            >>> addressClaimer = "Address Claimer"
            >>> claimedAt = "2019-05-13T17:42:000+0000"
            >>> emailClaimer = "samplemail@opencaribbean.org"
            >>> fullNameClaimer = "John Doe"
            >>> claimerId = "126248cd-0f19-40b1-81e3-51dc8e92a2c6"
            >>> imageEvidence = "https://media.opencaribbean.org/sdf3g4hj5kl6.png"
            >>> phoneClaimer = "7584322001553"
            >>> reason = "Some reason"
            >>> createClaimForm(addressClaimer,claimedAt,emailClaimer,fullNameClaimer,claimerId,userClaimerId,imageEvidence,phoneClaimer,reason)
        Output:


        {
        "addressClaimer": "string",
        "claimedAt": "2019-05-13T17:42:18.824Z",
        "emailClaimer": "string",
        "fullNameClaimer": "string",
        "idClaimer": "string",
        "idUserClaimer": "string",
        "imageEvidence": "string",
        "phoneClaimer": "string",
        "reason": "string"
        }
        """
        data = {"addressClaimer" : addressClaimer, "claimedAt": claimedAt, "emailClaimer": emailClaimer,
                "fullNameClaimer":fullNameClaimer,"idClaimer":claimerId,"idUserClaimer":userClaimerId,
                "imageEvidence":imageEvidence, "phoneClaimer":phoneClaimer,"reason":reason}
        
        return ExecuteQuery().Query(self.urlClaimForms,'POST',data)

    def updateClaimForm(self, claimId ,addressClaimer,claimedAt,emailClaimer,fullNameClaimer,claimerId,userClaimerId,imageEvidence,phoneClaimer,reason):
        """ 
        {
        "addressClaimer": "string",
        "claimedAt": "2019-05-13T17:42:18.824Z",
        "emailClaimer": "string",
        "fullNameClaimer": "string",
        "idClaimer": "string",
        "idUserClaimer": "string",
        "imageEvidence": "string",
        "phoneClaimer": "string",
        "reason": "string"
        }
        """
        data = {"addressClaimer" : addressClaimer, "claimedAt": claimedAt, "emailClaimer": emailClaimer,
                "fullNameClaimer":fullNameClaimer,"idClaimer":claimerId,"idUserClaimer":userClaimerId,
                "imageEvidence":imageEvidence, "phoneClaimer":phoneClaimer,"reason":reason}
        url = self.urlClaimForms + claimId
        return ExecuteQuery().Query(url,'PUT',data)
    
    
class ExecuteQuery:
    """ Class to execute queries
    Attributes:
        headers (dict): API headers
    """
    
    def __init__(self):
        self.headers = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'client': 'arawak-python-sdk'}
    
    def Query(self,url,typeQuery,data=''):
        jsonData = json.dumps(data)
        print jsonData
        try:
            if typeQuery == 'POST':
                request = requests.post(url, headers=self.headers,data=jsonData)
            elif typeQuery == 'PUT':
                request = requests.put(url, headers=self.headers,data=jsonData)
            elif typeQuery == 'GET':
                request = requests.get(url,headers=self.headers)
            elif typeQuery == 'DELETE':
                request = requests.delete(url,headers=self.headers)
            
            if request.status_code == 200 or request.status_code == 201 or request.status_code == 202:
                return request.content
            elif request.status_code == 204:
                return dict(status=request.status_code,message='No content')
            elif request.status_code == 401:
                return dict(status=request.status_code,message='You are not authorized to use this endpoint')
            elif request.status_code == 403:
                return dict(status=request.status_code,message=request.headers['errormessage'])
            elif request.status_code == 404:
                return dict(status=request.status_code,message='Not found')
            elif request.status_code == 406:
                return dict(status=request.status_code,message=request.headers['errormessage'])
            elif request.status_code == 410:
                return dict(status=request.status_code,message='Not allow update')
            elif request.status_code == 418:
                return dict(status=request.status_code,message=request.headers['errormessage'])
            else:
                #values = json.loads(request.content)
                return json.dumps(dict(status=request.status_code,message=request.content))
        except requests.exceptions.RequestException:
            raise
        except Exception:
            raise