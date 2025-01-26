# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



























import pandas as pd
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Load the dataset
train_data = pd.read_csv("train.csv")
val_data = pd.read_csv("val.csv")
test_data = pd.read_csv("test.csv")

# Create a T5 tokenizer
tokenizer = T5Tokenizer.from_pretrained("t5-small")

# Preprocess the data
train_encodings = tokenizer(train_data["input_text"], return_tensors="pt", max_length=512, truncation=True, padding="max_length")
val_encodings = tokenizer(val_data["input_text"], return_tensors="pt", max_length=512, truncation=True, padding="max_length")
test_encodings = tokenizer(test_data["input_text"], return_tensors="pt", max_length=512, truncation=True, padding="max_length")

# Create a custom dataset class
class ASLDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

# Create dataset instances
train_dataset = ASLDataset(train_encodings, train_data["asl_gloss"])
val_dataset = ASLDataset(val_encodings, val_data["asl_gloss"])
test_dataset = ASLDataset(test_encodings, test_data["asl_gloss"])

# Create data loaders
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=16, shuffle=True)
val_loader = torch.utils.data.DataLoader(val_dataset, batch_size=16, shuffle=False)
test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=16, shuffle=False)

# Load the pre-trained T5 model
model = T5ForConditionalGeneration.from_pretrained("t5-small")

# Set the device (GPU or CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Define the optimizer and scheduler
optimizer = torch.optim.Adam(model.parameters(), lr=1e-5)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)

# Train the model
for epoch in range(5):
    model.train()
    total_loss = 0
    for batch in train_loader:
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        labels = batch["labels"].to(device)

        optimizer.zero_grad()

        outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss

        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    scheduler.step()
    print(f"Epoch {epoch+1}, Loss: {total_loss / len(train_loader)}")

    model.eval()
    with torch.no_grad():
        total_loss = 0
        predictions = []
        labels = []
        for batch in val_loader:
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            batch_labels = batch["labels"].to(device)

            outputs = model(input_ids, attention_mask=attention_mask, labels=batch_labels)
            loss = outputs.loss

            total_loss += loss.item()

            logits = outputs.logits
            _, predicted = torch.max(logits, dim=1)
            predictions.extend(predicted.cpu().numpy())
            labels.extend(batch_labels.cpu().numpy())

        print(f"Epoch {epoch+1}, Val Loss: {total_loss / len(val_loader)}")
        print(f"Epoch {epoch+1}, Val Accuracy: {accuracy_score(labels, predictions)}")
        print(f"Epoch {epoch+1}, Val Classification Report:\n{classification_report(labels, predictions)}")
        print(f"Epoch {epoch+1}, Val Confusion Matrix:\n{confusion_matrix(labels, predictions)}")

# Evaluate the model on the test set
model.eval()
with torch.no_grad():
    total_loss = 0
    predictions = []
    labels = []
    for batch in test_loader:
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        batch_labels = batch["labels"].to(device)

        outputs = model(input_ids, attention_mask=attention_mask, labels=batch_labels)
        loss = outputs.loss

        total_loss += loss.item()

        logits = outputs.logits
        _, predicted = torch.max(logits, dim=1)
        predictions.extend(predicted.cpu().numpy())
        labels.extend(batch_labels.cpu().numpy())

    print(f"Test Loss: {total_loss / len(test_loader)}")
    print(f"Test Accuracy: {accuracy_score(labels, predictions)}")
    print(f"Test Classification Report:\n{classification_report(labels, predictions)}")
    print(f"Test Confusion Matrix:\n{confusion_matrix(labels, predictions)}")
