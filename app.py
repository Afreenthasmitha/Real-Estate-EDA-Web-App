from flask import Flask, jsonify, request
import pandas as pd

app = Flask(__name__)

# Load dataset
try:
    df = pd.read_csv("housing.csv")
    df.dropna(inplace=True)
except Exception as e:
    print("Error loading dataset:", e)
    df = pd.DataFrame()

# Home route
@app.route('/')
def home():
    return jsonify({
        "message": "Real Estate Advanced API Running",
        "endpoints": ["/data", "/summary", "/filter", "/search", "/correlation"]
    })

# Get all data
@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(df.to_dict(orient='records'))

# Get summary statistics
@app.route('/summary', methods=['GET'])
def summary():
    return jsonify(df.describe().to_dict())

# Filter data (price & area)
@app.route('/filter', methods=['GET'])
def filter_data():
    try:
        min_price = float(request.args.get('min_price', 0))
        max_price = float(request.args.get('max_price', df['price'].max()))
        min_area = float(request.args.get('min_area', 0))
        max_area = float(request.args.get('max_area', df['area'].max()))

        filtered = df[
            (df['price'] >= min_price) &
            (df['price'] <= max_price) &
            (df['area'] >= min_area) &
            (df['area'] <= max_area)
        ]

        return jsonify(filtered.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Search by bedrooms
@app.route('/search', methods=['GET'])
def search():
    try:
        bedrooms = int(request.args.get('bedrooms', 0))
        result = df[df['bedrooms'] == bedrooms]

        return jsonify(result.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Correlation matrix
@app.route('/correlation', methods=['GET'])
def correlation():
    try:
        corr = df.corr().to_dict()
        return jsonify(corr)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Top expensive houses
@app.route('/top', methods=['GET'])
def top_properties():
    try:
        top_n = int(request.args.get('n', 5))
        top = df.sort_values(by='price', ascending=False).head(top_n)

        return jsonify(top.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Run app
if __name__ == '__main__':
    app.run(debug=True)
