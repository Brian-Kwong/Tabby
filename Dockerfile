FROM public.ecr.aws/lambda/python:3.10-x86_64

# Copy function code

# Copy requirements.txt
COPY requirements.txt  .

# Install the specified packages
RUN pip install --upgrade pip
RUN pip3 install --default-timeout=10000  -r requirements.txt  --target "${LAMBDA_TASK_ROOT}"

COPY * ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.lambda_handler" ]  