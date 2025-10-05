# Create Schedule

> Create a schedule to send messages periodically

## Request

<ParamField path="destination" type="string" required>
  Destination can either be a topic name or id that you configured in the
  Upstash console or a valid url where the message gets sent to.
  If the destination is a URL, make sure
  the URL is prefixed with a valid protocol (`http://` or `https://`)
</ParamField>

<ParamField header="Upstash-Cron" type="string" required>
  Cron allows you to send this message periodically on a schedule.

  Add a Cron expression and we will requeue this message automatically whenever
  the Cron expression triggers. We offer an easy to use UI for creating Cron
  expressions in our [console](https://console.upstash.com/qstash) or you can
  check out [Crontab.guru](https://crontab.guru).

  Note: it can take up to 60 seconds until the schedule is registered on an
  available qstash node.

  Example: `*/5 * * * *`

  Timezones are also supported. You can specify timezone together with cron expression
  as follows:

  Example: `CRON_TZ=America/New_York 0 4 * * *`
</ParamField>

<Snippet file="qstash-common-request.mdx" />

<ParamField header="Upstash-Delay" type="string">
  Delay the message delivery.

  Delay applies to the delivery of the scheduled messages.
  For example, with the delay set to 10 minutes for a schedule
  that runs everyday at 00:00, the scheduled message will be
  created at 00:00 and it will be delivered at 00:10.

  Format for this header is a number followed by duration abbreviation, like
  `10s`. Available durations are `s` (seconds), `m` (minutes), `h` (hours), `d`
  (days).

  example: "50s" | "3m" | "10h" | "1d"
</ParamField>

<ParamField header="Upstash-Schedule-Id" type="string">
  Assign a schedule id to the created schedule.

  This header allows you to set the schedule id yourself instead of QStash assigning
  a random id.

  If a schedule with the provided id exists, the settings of the existing schedule
  will be updated with the new settings.
</ParamField>

## Response

<ResponseField name="scheduleId" type="string" required>
  The unique id of this schedule. You can use it to delete the schedule later.
</ResponseField>

<RequestExample>
  ```sh curl
  curl -XPOST https://qstash.upstash.io/v2/schedules/https://www.example.com/endpoint \
    -H "Authorization: Bearer <token>" \
    -H "Upstash-Cron: */5 * * * *"
  ```

  ```js Node
  const response = await fetch('https://qstash.upstash.io/v2/schedules/https://www.example.com/endpoint', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer <token>',
      'Upstash-Cron': '*/5 * * * *'
    }
  });
  ```

  ```python Python
  import requests

  headers = {
      'Authorization': 'Bearer <token>',
      'Upstash-Cron': '*/5 * * * *'
  }

  response = requests.post(
    'https://qstash.upstash.io/v2/schedules/https://www.example.com/endpoint',
     headers=headers
  )
  ```

  ```go Go 
  req, err := http.NewRequest("POST", "https://qstash.upstash.io/v2/schedules/https://www.example.com/endpoint", nil)
  if err != nil {
    log.Fatal(err)
  }
  req.Header.Set("Authorization", "Bearer <token>")
  req.Header.Set("Upstash-Cron", "*/5 * * * *")
  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    log.Fatal(err)
  }
  defer resp.Body.Close()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 OK
  {
    "scheduleId": "scd_1234"
  }
  ```
</ResponseExample>



# Get Schedule

> Retrieves a schedule by id.

## Request

<ParamField path="scheduleId" type="string" required>
  The id of the schedule to retrieve.
</ParamField>

## Response

<ResponseField name="createdAt" type="int" required>
  The creation time of the object. UnixMilli
</ResponseField>

<ResponseField name="scheduleId" type="string" required>
  The id of the schedule.
</ResponseField>

<ResponseField name="cron" type="string" required>
  The cron expression used to schedule the message.
</ResponseField>

<ResponseField name="callerIP" type="string" required>
  IP address where this schedule created from.
</ResponseField>

<ResponseField name="destination" type="string" required>
  Url or URL Group name
</ResponseField>

<ResponseField name="method" type="string" required>
  The HTTP method to use for the message.
</ResponseField>

<ResponseField name="header" type="Record<string, string[]>" required>
  The headers of the message.
</ResponseField>

<ResponseField name="body" type="string" required>
  The body of the message.
</ResponseField>

<ResponseField name="retries" type="int">
  The number of retries that should be attempted in case of delivery failure.
</ResponseField>

<ResponseField name="delay" type="int">
  The delay in seconds before the message is delivered.
</ResponseField>

<ResponseField name="callback" type="string">
  The url where we send a callback to after the message is delivered
</ResponseField>

<RequestExample>
  ```sh curl
  curl https://qstash.upstash.io/v2/schedules/scd_1234 \
    -H "Authorization: Bearer <token>"
  ```

  ```js Node
  const response = await fetch('https://qstash.upstash.io/v2/schedules/scd_1234', {
    headers: {
      'Authorization': 'Bearer <token>'
    }
  });
  ```

  ```python Python 
  import requests

  headers = {
      'Authorization': 'Bearer <token>',
  }

  response = requests.get(
    'https://qstash.upstash.io/v2/schedules/scd_1234', 
    headers=headers
  )
  ```

  ```go Go
  req, err := http.NewRequest("GET", "https://qstash.upstash.io/v2/schedules/scd_1234", nil)
  if err != nil {
    log.Fatal(err)
  }
  req.Header.Set("Authorization", "Bearer <token>")
  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    log.Fatal(err)
  }
  defer resp.Body.Close()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 OK
  {
    "scheduleId": "scd_1234",
    "createdAt": 1623345678001,
    "cron": "0 0 1 * *",
    "destination": "https://example.com",
    "method": "POST",
    "header": {
      "Content-Type": ["application/json"]
    },
    "body": "{\"message\":\"hello\"}",
    "retries": 3
  }
  ```
</ResponseExample>


# List Schedules

> List all your schedules

## Response

<ResponseField name="array" type="Object[]">
  <ResponseField name="createdAt" type="int" required>
    The creation time of the object. UnixMilli
  </ResponseField>

  <ResponseField name="id" type="string" required>
    The id of the schedule.
  </ResponseField>

  <ResponseField name="cron" type="string" required>
    The cron expression used to schedule the message.
  </ResponseField>

  <ResponseField name="destination" type="string" required>
    Url or URL Group (topic) name
  </ResponseField>

  <ResponseField name="method" type="string" required>
    The HTTP method to use for the message.
  </ResponseField>

  <ResponseField name="header" type="Record<string, string[]>" required>
    The headers of the message.
  </ResponseField>

  <ResponseField name="body" type="string" required>
    The body of the message.
  </ResponseField>

  <ResponseField name="retries" type="int">
    The number of retries that should be attempted in case of delivery failure.
  </ResponseField>

  <ResponseField name="delay" type="int">
    The delay in seconds before the message is delivered.
  </ResponseField>

  <ResponseField name="callback" type="string">
    The url where we send a callback to after the message is delivered
  </ResponseField>
</ResponseField>

<RequestExample>
  ```sh curl
  curl https://qstash.upstash.io/v2/schedules \
    -H "Authorization: Bearer <token>"
  ```

  ```js Node
  const response = await fetch('https://qstash.upstash.io/v2/schedules', {
    headers: {
      'Authorization': 'Bearer <token>'
    }
  });
  ```

  ```python Python 
  import requests

  headers = {
      'Authorization': 'Bearer <token>',
  }

  response = requests.get(
    'https://qstash.upstash.io/v2/schedules', 
    headers=headers
  )
  ```

  ```go Go
  req, err := http.NewRequest("GET", "https://qstash.upstash.io/v2/schedules", nil)
  if err != nil {
    log.Fatal(err)
  }
  req.Header.Set("Authorization", "Bearer <token>")
  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    log.Fatal(err)
  }
  defer resp.Body.Close()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 OK
  [
    {
      "scheduleId": "scd_1234",
      "createdAt": 1623345678001,
      "cron": "0 0 1 * *",
      "destination": "https://example.com",
      "method": "POST",
      "header": {
        "Content-Type": ["application/json"]
      },
      "body": "{\"message\":\"hello\"}",
      "retries": 3
    }
  ]
  ```
</ResponseExample>


# Remove Schedule

> Remove a schedule

## Request

<ParamField path="scheduleId" type="string">
  The schedule id to remove
</ParamField>

## Response

This endpoint simply returns 200 OK if the schedule is removed successfully.

<RequestExample>
  ```sh curl
  curl -XDELETE https://qstash.upstash.io/v2/schedules/scd_123 \
    -H "Authorization: Bearer <token>"
  ```

  ```javascript Node
  const response = await fetch('https://qstash.upstash.io/v2/schedules/scd_123', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer <token>'
    }
  });
  ```

  ```python Python
  import requests

  headers = {
      'Authorization': 'Bearer <token>',
  }

  response = requests.delete(
    'https://qstash.upstash.io/v2/schedules/scd_123', 
    headers=headers
  )
  ```

  ```go Go 
  req, err := http.NewRequest("DELETE", "https://qstash.upstash.io/v2/schedules/scd_123", nil)
  if err != nil {
    log.Fatal(err)
  }
  req.Header.Set("Authorization", "Bearer <token>")
  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    log.Fatal(err)
  }
  defer resp.Body.Close()
  ```
</RequestExample>


# Remove Schedule

> Remove a schedule

## Request

<ParamField path="scheduleId" type="string">
  The schedule id to remove
</ParamField>

## Response

This endpoint simply returns 200 OK if the schedule is removed successfully.

<RequestExample>
  ```sh curl
  curl -XDELETE https://qstash.upstash.io/v2/schedules/scd_123 \
    -H "Authorization: Bearer <token>"
  ```

  ```javascript Node
  const response = await fetch('https://qstash.upstash.io/v2/schedules/scd_123', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer <token>'
    }
  });
  ```

  ```python Python
  import requests

  headers = {
      'Authorization': 'Bearer <token>',
  }

  response = requests.delete(
    'https://qstash.upstash.io/v2/schedules/scd_123', 
    headers=headers
  )
  ```

  ```go Go 
  req, err := http.NewRequest("DELETE", "https://qstash.upstash.io/v2/schedules/scd_123", nil)
  if err != nil {
    log.Fatal(err)
  }
  req.Header.Set("Authorization", "Bearer <token>")
  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    log.Fatal(err)
  }
  defer resp.Body.Close()
  ```
</RequestExample>


# Remove Schedule

> Remove a schedule

## Request

<ParamField path="scheduleId" type="string">
  The schedule id to remove
</ParamField>

## Response

This endpoint simply returns 200 OK if the schedule is removed successfully.

<RequestExample>
  ```sh curl
  curl -XDELETE https://qstash.upstash.io/v2/schedules/scd_123 \
    -H "Authorization: Bearer <token>"
  ```

  ```javascript Node
  const response = await fetch('https://qstash.upstash.io/v2/schedules/scd_123', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer <token>'
    }
  });
  ```

  ```python Python
  import requests

  headers = {
      'Authorization': 'Bearer <token>',
  }

  response = requests.delete(
    'https://qstash.upstash.io/v2/schedules/scd_123', 
    headers=headers
  )
  ```

  ```go Go 
  req, err := http.NewRequest("DELETE", "https://qstash.upstash.io/v2/schedules/scd_123", nil)
  if err != nil {
    log.Fatal(err)
  }
  req.Header.Set("Authorization", "Bearer <token>")
  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    log.Fatal(err)
  }
  defer resp.Body.Close()
  ```
</RequestExample>
