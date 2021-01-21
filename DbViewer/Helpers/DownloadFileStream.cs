using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

using SkbKontur.DbViewer.Configuration;

namespace SkbKontur.DbViewer.Helpers
{
    public class DownloadFileStream : Stream
    {
        public DownloadFileStream(Type type, object?[] objects, string[] excludedFields, ICustomPropertyConfigurationProvider customPropertyConfigurationProvider, int downloadLimit)
        {
            var properties = new List<string>();
            var getters = new List<Func<object?, object?>>();

            PropertyHelpers.BuildGettersForProperties(type, "", x => x, properties, getters, customPropertyConfigurationProvider);

            var excludedIndices = properties.Select((x, i) => (x, i)).Where(x => excludedFields.Contains(x.x)).Select(x => x.i).ToArray();
            formatter = new CsvFormatter(
                objects,
                properties.Where((x, i) => !excludedIndices.Contains(i)).ToArray(),
                getters.Where((x, i) => !excludedIndices.Contains(i)).ToArray()
            );
        }

        public override void Flush()
        {
            throw new NotImplementedException();
        }

        public override int Read(byte[] buffer, int offset, int count)
        {
            if (dataIndex == -1)
            {
                readBuffer = formatter.GetHeader();
                bufferIndex = 0;
                dataIndex = 0;
            }

            if (bufferIndex >= readBuffer.Length)
            {
                readBuffer = formatter.GetRows(dataIndex, dataIndex + 1000);
                bufferIndex = 0;
                dataIndex += 1000;
            }

            var length = Math.Min(count, readBuffer.Length - bufferIndex);
            var sourceIndex = bufferIndex;
            bufferIndex += length;
            Array.Copy(readBuffer, sourceIndex, buffer, offset, length);
            return length;
        }

        public override long Seek(long offset, SeekOrigin origin)
        {
            throw new NotImplementedException();
        }

        public override void SetLength(long value)
        {
            throw new NotImplementedException();
        }

        public override void Write(byte[] buffer, int offset, int count)
        {
            throw new NotImplementedException();
        }

        public override bool CanRead => true;
        public override bool CanSeek => false;
        public override bool CanWrite => false;
        public override long Length => throw new NotImplementedException();
        public override long Position { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        private int dataIndex = -1;

        private byte[] readBuffer = new byte[0];
        private int bufferIndex = 0;

        private readonly CsvFormatter formatter;
    }
}